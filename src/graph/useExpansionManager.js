import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';
import useTopologyStore from '../store/topologyStore';
import { ALL_EXPANSION_MAP, EXPANDABLE_IDS } from '../data/topologyData';
import {
  ntpl_getAllDescendantIds,
  ntpl_getAllDescendantEdgeIds,
} from '../utils/graphUtils';
import { ntpl_selectLayout } from '../layouts/layoutConfigs';

/**
 * Hook providing expand / collapse operations for topology group nodes.
 *
 * Strategy:
 *   — Expansions use Cytoscape's compound-node model: children are added
 *     with a `parent` attribute pointing to their group node ID.
 *   — This transforms the group node into a compound container, rendering
 *     as a translucent rounded-rectangle (styled via node:parent selector).
 *   — All mutations are applied via cy.batch() for a single redraw cycle.
 *   — Layout is re-run after every structural change.
 *
 * Args:
 *   None (reads CytoscapeContext and useTopologyStore internally)
 *
 * Returns:
 *   Object: { ntpl_expandGroup, ntpl_collapseGroup, ntpl_collapseAllGroups,
 *             ntpl_toggleGroup, ntpl_isGroupExpanded, ntpl_canExpand }
 *
 * Raises:
 *   None — all methods fail silently with console.error.
 */
export function useExpansionManager() {
  const { getCy } = useCytoscapeContext();

  // ── Private helpers ─────────────────────────────────────────────────────

  /**
   * Determines the maximum node level currently visible in the graph.
   * Used to select the right layout density.
   *
   * Args:
   *   cy (Object): Live Cytoscape instance.
   *
   * Returns:
   *   number: 0, 1, or 2.
   *
   * Raises:
   *   None
   */
  const ntpl_getMaxLevel = useCallback((cy) => {
    try {
      let max = 0;
      cy.nodes().forEach((node) => {
        const level = node.data('level');
        if (typeof level === 'number' && level > max) max = level;
      });
      return max;
    } catch (error) {
      console.error('[ntpl_getMaxLevel] Error:', error);
      return 0;
    }
  }, []);

  /**
   * Runs the layout appropriate for the current graph density.
   *
   * Args:
   *   cy (Object): Live Cytoscape instance.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_rerunLayout = useCallback((cy) => {
    try {
      const maxLevel = ntpl_getMaxLevel(cy);
      const config   = ntpl_selectLayout(maxLevel);
      cy.layout(config).run();
    } catch (error) {
      console.error('[ntpl_rerunLayout] Layout failed, attempting fallback:', error);
      try {
        cy.layout({ name: 'breadthfirst', directed: true, padding: 80, fit: true }).run();
      } catch (fallbackErr) {
        console.error('[ntpl_rerunLayout] Fallback also failed:', fallbackErr);
      }
    }
  }, [ntpl_getMaxLevel]);

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Expands a group node by adding its child nodes and edges to the graph.
   * Children receive a `parent` attribute pointing to groupId, causing
   * Cytoscape to render the parent as a compound container.
   *
   * Args:
   *   groupId (string): The node ID of the group to expand.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error and returns early on failure.
   */
  const ntpl_expandGroup = useCallback(
    (groupId) => {
      try {
        const cy = getCy();
        if (!cy) return;

        const entry = ALL_EXPANSION_MAP[groupId];
        if (!entry) return;

        const { expandedGroups, expandGroup, setExpanding } = useTopologyStore.getState();
        if (expandedGroups.has(groupId)) return;

        setExpanding(true);

        cy.batch(() => {
          // Add child nodes with compound parent relationship
          for (const nodeSpec of entry.nodes) {
            const id = nodeSpec.data.id;
            if (cy.getElementById(id).length === 0) {
              cy.add({
                group: 'nodes',
                data:  { ...nodeSpec.data, parent: groupId },
              });
            }
          }

          // Add child edges
          for (const edgeSpec of entry.edges) {
            const id = edgeSpec.data.id;
            if (cy.getElementById(id).length === 0) {
              cy.add({ group: 'edges', data: edgeSpec.data });
            }
          }
        });

        expandGroup(groupId);
        ntpl_rerunLayout(cy);
        setExpanding(false);
      } catch (error) {
        console.error('[ntpl_expandGroup] Failed to expand', groupId, ':', error);
        useTopologyStore.getState().setExpanding(false);
      }
    },
    [getCy, ntpl_rerunLayout],
  );

  /**
   * Collapses a group node by removing all of its descendants from the graph.
   * Recursively collapses any expanded sub-groups within the group first.
   *
   * Args:
   *   groupId (string): The node ID of the group to collapse.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error and returns early on failure.
   */
  const ntpl_collapseGroup = useCallback(
    (groupId) => {
      try {
        const cy = getCy();
        if (!cy) return;

        const { expandedGroups, collapseGroup, setExpanding, clearSelection } =
          useTopologyStore.getState();

        if (!expandedGroups.has(groupId)) return;

        setExpanding(true);

        const nodeIds = ntpl_getAllDescendantIds(groupId, expandedGroups);
        const edgeIds = ntpl_getAllDescendantEdgeIds(groupId, expandedGroups);

        // Remove descendants from store (children of children first)
        const expandedDescendants = nodeIds.filter((id) => expandedGroups.has(id));
        for (const id of expandedDescendants) {
          collapseGroup(id);
        }

        cy.batch(() => {
          // Remove all descendant edges first (avoids orphan edge errors)
          for (const id of edgeIds) {
            const ele = cy.getElementById(id);
            if (ele.length > 0) ele.remove();
          }
          // Remove descendant nodes
          for (const id of nodeIds) {
            const ele = cy.getElementById(id);
            if (ele.length > 0) ele.remove();
          }
        });

        collapseGroup(groupId);

        // Clear selection if selected node was a descendant
        const { selectedNodeId } = useTopologyStore.getState();
        if (nodeIds.includes(selectedNodeId)) clearSelection();

        ntpl_rerunLayout(cy);
        setExpanding(false);
      } catch (error) {
        console.error('[ntpl_collapseGroup] Failed to collapse', groupId, ':', error);
        useTopologyStore.getState().setExpanding(false);
      }
    },
    [getCy, ntpl_rerunLayout],
  );

  /**
   * Collapses all currently expanded groups in the graph at once.
   * Processes top-level groups first to avoid double-processing descendants.
   *
   * Args:
   *   None
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error on failure.
   */
  const ntpl_collapseAllGroups = useCallback(() => {
    try {
      const cy = getCy();
      if (!cy) return;

      const { expandedGroups, collapseAll, clearSelection, setExpanding } =
        useTopologyStore.getState();

      if (expandedGroups.size === 0) return;

      setExpanding(true);

      // Collect ALL descendant node/edge IDs across all expanded groups
      const allNodeIds = new Set();
      const allEdgeIds = new Set();

      for (const groupId of expandedGroups) {
        ntpl_getAllDescendantIds(groupId, expandedGroups).forEach((id) =>
          allNodeIds.add(id),
        );
        ntpl_getAllDescendantEdgeIds(groupId, expandedGroups).forEach((id) =>
          allEdgeIds.add(id),
        );
      }

      cy.batch(() => {
        for (const id of allEdgeIds) {
          const ele = cy.getElementById(id);
          if (ele.length > 0) ele.remove();
        }
        for (const id of allNodeIds) {
          const ele = cy.getElementById(id);
          if (ele.length > 0) ele.remove();
        }
      });

      collapseAll();
      clearSelection();
      ntpl_rerunLayout(cy);
      setExpanding(false);
    } catch (error) {
      console.error('[ntpl_collapseAllGroups] Failed:', error);
      useTopologyStore.getState().setExpanding(false);
    }
  }, [getCy, ntpl_rerunLayout]);

  /**
   * Toggles expansion of a group: expands if collapsed, collapses if expanded.
   *
   * Args:
   *   groupId (string): The node ID to toggle.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_toggleGroup = useCallback(
    (groupId) => {
      try {
        const { expandedGroups } = useTopologyStore.getState();
        if (expandedGroups.has(groupId)) {
          ntpl_collapseGroup(groupId);
        } else {
          ntpl_expandGroup(groupId);
        }
      } catch (error) {
        console.error('[ntpl_toggleGroup] Error for', groupId, ':', error);
      }
    },
    [ntpl_expandGroup, ntpl_collapseGroup],
  );

  /**
   * Returns true if the given group is currently expanded.
   *
   * Args:
   *   groupId (string): The group node ID to check.
   *
   * Returns:
   *   boolean: True if expanded.
   *
   * Raises:
   *   None
   */
  const ntpl_isGroupExpanded = useCallback((groupId) => {
    try {
      return useTopologyStore.getState().expandedGroups.has(groupId);
    } catch (error) {
      return false;
    }
  }, []);

  /**
   * Returns true if the given node ID has expansion data.
   *
   * Args:
   *   nodeId (string): Node ID to check.
   *
   * Returns:
   *   boolean: True if the node can be expanded.
   *
   * Raises:
   *   None
   */
  const ntpl_canExpand = useCallback((nodeId) => {
    try {
      return EXPANDABLE_IDS.has(nodeId);
    } catch (error) {
      return false;
    }
  }, []);

  return {
    ntpl_expandGroup,
    ntpl_collapseGroup,
    ntpl_collapseAllGroups,
    ntpl_toggleGroup,
    ntpl_isGroupExpanded,
    ntpl_canExpand,
  };
}
