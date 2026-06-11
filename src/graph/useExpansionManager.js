import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';
import useTopologyStore from '../store/topologyStore';
import { ALL_EXPANSION_MAP, EXPANDABLE_IDS } from '../data/topologyData';
import {
  ntpl_getAllDescendantIds,
  ntpl_getAllDescendantEdgeIds,
} from '../utils/graphUtils';

// ─── Radial geometry ──────────────────────────────────────────────────────────

/**
 * Computes evenly-spaced radial positions for children arranged in a circle
 * around a parent node.
 *
 * Radius is derived from geometry, not a fixed constant:
 *   The minimum circumference needed so adjacent node circles don't overlap is
 *   count × (2 × childHalfSize + minGap). R = circumference / 2π.
 *   The actual radius is max(geometricMin, baseRadius).
 *
 * Args:
 *   parentPos   ({x: number, y: number}): Absolute canvas position of the parent.
 *   count       (number): Number of children to place.
 *   parentLevel (number): Hierarchy level of the parent (0 = backbone, 1 = sub-group).
 *
 * Returns:
 *   Array<{x: number, y: number}>: One position per child, clockwise from 12 o'clock.
 *
 * Raises:
 *   None — returns empty array on error.
 */
function ntpl_getRadialPositions(parentPos, count, parentLevel = 0) {
  try {
    if (count === 0) return [];

    // Child node visual radius at the next level down (px)
    const childHalfSize = parentLevel === 0 ? 36 : 26;
    const minGap        = 32; // minimum canvas gap between node edges

    // Ensure the arc between adjacent children is wide enough to not overlap
    const minSlice             = 2 * childHalfSize + minGap;
    const radiusFromGeometry   = (count * minSlice) / (2 * Math.PI);
    const baseRadius           = parentLevel === 0 ? 210 : 170;
    const radius               = Math.max(baseRadius, radiusFromGeometry);

    if (count === 1) {
      return [{ x: parentPos.x, y: parentPos.y - radius }];
    }

    return Array.from({ length: count }, (_, i) => {
      const angle = (2 * Math.PI * i / count) - Math.PI / 2; // 12 o'clock start
      return {
        x: parentPos.x + radius * Math.cos(angle),
        y: parentPos.y + radius * Math.sin(angle),
      };
    });
  } catch (error) {
    console.error('[ntpl_getRadialPositions] Error:', error);
    return Array.from({ length: count }, () => ({ ...parentPos }));
  }
}

// ─── Focus mode ───────────────────────────────────────────────────────────────

/**
 * Recomputes and applies focus-mode CSS classes to every graph element based
 * on the current exploration path.
 *
 * Three visibility tiers:
 *   Full (no class)     — The deepest expanded group and its direct children.
 *                         The user's current point of attention.
 *   ancestor-dim (50%) — Groups higher in the exploration path and their
 *                         non-focus siblings. Provides spatial context.
 *   context-fade (22%) — Everything else (unrelated backbone, edges between
 *                         non-active nodes). Nearly invisible, just hints.
 *
 * Args:
 *   cy              (Object): Live Cytoscape core instance.
 *   explorationPath (Array<{id: string, label: string}>):
 *                   Current drill-down path from root to deepest expanded group.
 *
 * Returns:
 *   void
 *
 * Raises:
 *   None
 */
function ntpl_applyFocusMode(cy, explorationPath) {
  try {
    // Clear all focus-mode classes before recomputing
    cy.elements().removeClass('context-fade ancestor-dim');

    // Nothing expanded → full visibility restored
    if (!explorationPath || explorationPath.length === 0) return;

    // ── Build membership sets ─────────────────────────────────────────────

    const focusId    = explorationPath[explorationPath.length - 1].id;
    const focusEntry = ALL_EXPANSION_MAP[focusId];

    // Full-visibility set: the focus group + all its direct children
    const focusSet = new Set([focusId]);
    if (focusEntry) {
      focusEntry.nodes.forEach((s) => focusSet.add(s.data.id));
    }

    // Ancestor-dim set: all ancestor groups + their non-focus children (siblings)
    const ancestorNodeSet = new Set();
    for (let i = 0; i < explorationPath.length - 1; i++) {
      const ancestorId    = explorationPath[i].id;
      const nextInPathId  = explorationPath[i + 1].id;
      ancestorNodeSet.add(ancestorId);

      const ancestorEntry = ALL_EXPANSION_MAP[ancestorId];
      if (ancestorEntry) {
        ancestorEntry.nodes.forEach((s) => {
          // Include siblings of the next-in-path item, not the path item itself
          if (s.data.id !== nextInPathId) {
            ancestorNodeSet.add(s.data.id);
          }
        });
      }
    }

    // ── Apply to nodes ────────────────────────────────────────────────────

    cy.nodes().forEach((node) => {
      const id = node.id();
      if (focusSet.has(id)) {
        // Focus level — full visibility, no class
      } else if (ancestorNodeSet.has(id)) {
        node.addClass('ancestor-dim');
      } else {
        node.addClass('context-fade');
      }
    });

    // ── Apply to edges ────────────────────────────────────────────────────
    // An edge is visible at the level of its higher-ranked endpoint.

    cy.edges().forEach((edge) => {
      const srcId = edge.source().id();
      const tgtId = edge.target().id();

      const srcFocus    = focusSet.has(srcId);
      const tgtFocus    = focusSet.has(tgtId);
      const srcAncestor = ancestorNodeSet.has(srcId);
      const tgtAncestor = ancestorNodeSet.has(tgtId);

      if (srcFocus && tgtFocus) {
        // Both endpoints at the focus level → full visibility
      } else if (srcFocus || tgtFocus || srcAncestor || tgtAncestor) {
        // At least one endpoint is active → ancestor-dim
        edge.addClass('ancestor-dim');
      } else {
        // Purely unrelated → fade to nothing
        edge.addClass('context-fade');
      }
    });
  } catch (error) {
    console.error('[ntpl_applyFocusMode] Error:', error);
  }
}

// ─── Backbone helpers ─────────────────────────────────────────────────────────

/**
 * Returns backbone nodes — nodes without a parentGroup (from the initial load).
 * Used to determine the fit target after a full collapse.
 *
 * Args:
 *   cy (Object): Live Cytoscape core instance.
 *
 * Returns:
 *   cytoscape.Collection
 *
 * Raises:
 *   None
 */
function ntpl_getBackboneNodes(cy) {
  return cy.nodes().filter((n) => !n.data('parentGroup'));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Hook providing focus-based expand / collapse operations.
 *
 * Expansion model:
 *   — No compound nodes. Hierarchy is represented purely by position and opacity.
 *   — On expand: push groupId to explorationPath, apply focus mode (everything
 *     else fades), animate children outward from the parent center.
 *   — On collapse: retract children, pop from explorationPath, recompute focus.
 *   — Only ONE level is visually dominant at any time. Ancestors fade to 50%;
 *     unrelated backbone fades to 22%. Backbone edges become nearly invisible.
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

  // ── Expand ───────────────────────────────────────────────────────────────

  /**
   * Expands a group with a three-phase focus-based animation.
   *
   * Phase 1 (0–380 ms): Camera zooms toward the parent node.
   * Phase 2 (420 ms+):  Children spawn at the parent center (opacity 0) and
   *                     animate outward to computed radial positions. Focus mode
   *                     is applied immediately — unrelated elements fade out.
   * Phase 3 (after all child animations complete): Camera fits parent + children.
   *
   * Args:
   *   groupId (string): Node ID of the group to expand.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error and clears the loading flag on failure.
   */
  const ntpl_expandGroup = useCallback(
    (groupId) => {
      try {
        const cy = getCy();
        if (!cy) return;

        const entry = ALL_EXPANSION_MAP[groupId];
        if (!entry) return;

        const {
          expandedGroups,
          expandGroup,
          setExpanding,
          pushExplorationPath,
          explorationPath,
        } = useTopologyStore.getState();

        if (expandedGroups.has(groupId)) return;

        setExpanding(true);

        const parentNode  = cy.getElementById(groupId);
        if (parentNode.empty()) { setExpanding(false); return; }

        const parentPos   = { ...parentNode.position() };
        const parentLevel = Number(parentNode.data('level') ?? 0);
        const positions   = ntpl_getRadialPositions(parentPos, entry.nodes.length, parentLevel);

        // Save pre-expansion position for exact restore on collapse
        parentNode.data('_savedX', parentPos.x);
        parentNode.data('_savedY', parentPos.y);

        // Push to exploration path before Phase 1 so focus mode can reference it
        const parentLabel = parentNode.data('label') || groupId;
        pushExplorationPath({ id: groupId, label: parentLabel });

        // Phase 1 — fly camera toward the expanding group
        cy.animate({
          center:   { eles: parentNode },
          zoom:     Math.min(cy.zoom() * 1.20, 2.2),
          duration: 380,
          easing:   'ease-in-out-cubic',
        });

        setTimeout(() => {
          try {
            const activeCy = getCy();
            if (!activeCy || activeCy !== cy) { setExpanding(false); return; }

            // Phase 2 — add children at parent center, then apply focus mode
            cy.batch(() => {
              entry.nodes.forEach((nodeSpec) => {
                if (cy.getElementById(nodeSpec.data.id).length === 0) {
                  cy.add({
                    group:    'nodes',
                    data:     { ...nodeSpec.data }, // no parent field — no compound nodes
                    position: { ...parentPos },     // spawn at parent center
                  });
                  cy.getElementById(nodeSpec.data.id).style({ opacity: 0 });
                }
              });

              for (const edgeSpec of entry.edges) {
                if (cy.getElementById(edgeSpec.data.id).length === 0) {
                  cy.add({ group: 'edges', data: edgeSpec.data });
                  cy.getElementById(edgeSpec.data.id).style({ opacity: 0 });
                }
              }
            });

            // Apply focus mode immediately — everything outside the focus level fades
            const currentPath = useTopologyStore.getState().explorationPath;
            ntpl_applyFocusMode(cy, currentPath);

            expandGroup(groupId);

            // Animate children outward from parent center (staggered bloom)
            entry.nodes.forEach((nodeSpec, i) => {
              const node = cy.getElementById(nodeSpec.data.id);
              if (node.empty()) return;
              node.delay(i * 35).animate(
                {
                  position: positions[i] ?? parentPos,
                  style:    { opacity: 1 },
                },
                { duration: 320, easing: 'ease-out-cubic' },
              );
            });

            // Expansion edges fade in after nodes reach their positions
            const edgeRevealDelay = entry.nodes.length * 35 + 340;
            for (const edgeSpec of entry.edges) {
              const edge = cy.getElementById(edgeSpec.data.id);
              if (!edge.empty()) {
                edge.delay(edgeRevealDelay).animate(
                  { style: { opacity: 0.80 } },
                  { duration: 180 },
                );
              }
            }

            // Phase 3 — after all animations, fit the focus area into the viewport
            const totalAnimMs = edgeRevealDelay + 220;
            setTimeout(() => {
              try {
                const childEles = entry.nodes.reduce((col, s) => {
                  const n = cy.getElementById(s.data.id);
                  return n.empty() ? col : col.union(n);
                }, cy.collection());

                if (!parentNode.empty() && childEles.length > 0) {
                  const focusEles = parentNode
                    .union(childEles)
                    .union(childEles.connectedEdges());
                  cy.animate({
                    fit:      { eles: focusEles, padding: 120 },
                    duration: 420,
                    easing:   'ease-in-out-cubic',
                  });
                }
                useTopologyStore.getState().setExpanding(false);
              } catch (fitErr) {
                console.error('[ntpl_expandGroup] Fit phase failed:', fitErr);
                useTopologyStore.getState().setExpanding(false);
              }
            }, totalAnimMs);
          } catch (err) {
            console.error('[ntpl_expandGroup] Child-placement phase failed:', err);
            useTopologyStore.getState().setExpanding(false);
          }
        }, 420);
      } catch (error) {
        console.error('[ntpl_expandGroup] Failed to expand', groupId, ':', error);
        useTopologyStore.getState().setExpanding(false);
      }
    },
    [getCy],
  );

  // ── Collapse ─────────────────────────────────────────────────────────────

  /**
   * Collapses a group: retracts children back toward the parent, removes them,
   * pops the exploration path, and reapplies focus mode for the remaining path.
   *
   * Args:
   *   groupId (string): Node ID of the group to collapse.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error on failure.
   */
  const ntpl_collapseGroup = useCallback(
    (groupId) => {
      try {
        const cy = getCy();
        if (!cy) return;

        const {
          expandedGroups,
          collapseGroup,
          setExpanding,
          clearSelection,
          removeFromExplorationPath,
        } = useTopologyStore.getState();

        if (!expandedGroups.has(groupId)) return;

        setExpanding(true);

        const nodeIds = ntpl_getAllDescendantIds(groupId, expandedGroups);
        const edgeIds = ntpl_getAllDescendantEdgeIds(groupId, expandedGroups);

        // Retract: children animate back toward the parent, then fade out
        const groupNode  = cy.getElementById(groupId);
        const retractPos = groupNode.empty() ? { x: 0, y: 0 } : { ...groupNode.position() };

        cy.batch(() => {
          for (const id of edgeIds) {
            const ele = cy.getElementById(id);
            if (ele.length > 0) ele.style({ opacity: 0 });
          }
        });

        for (const id of nodeIds) {
          const ele = cy.getElementById(id);
          if (ele.length > 0) {
            ele.animate(
              { position: retractPos, style: { opacity: 0 } },
              { duration: 240, easing: 'ease-in-cubic' },
            );
          }
        }

        setTimeout(() => {
          try {
            cy.batch(() => {
              for (const id of edgeIds) {
                const ele = cy.getElementById(id);
                if (ele.length > 0) ele.remove();
              }
              for (const id of nodeIds) {
                const ele = cy.getElementById(id);
                if (ele.length > 0) ele.remove();
              }
            });

            // Cascade-collapse any sub-groups that were inside this group
            const expandedDescendants = nodeIds.filter((id) => expandedGroups.has(id));
            for (const id of expandedDescendants) collapseGroup(id);
            collapseGroup(groupId);

            // Restore parent to its pre-expansion position
            if (!groupNode.empty()) {
              const savedX = groupNode.data('_savedX');
              const savedY = groupNode.data('_savedY');
              if (savedX != null && savedY != null) {
                groupNode.position({ x: savedX, y: savedY });
              }
            }

            // Pop this group (and any deeper items) from the exploration path
            removeFromExplorationPath(groupId);

            // Recompute focus mode for the remaining path
            const updatedPath = useTopologyStore.getState().explorationPath;
            ntpl_applyFocusMode(cy, updatedPath);

            const { selectedNodeId } = useTopologyStore.getState();
            if (nodeIds.includes(selectedNodeId)) clearSelection();

            // Camera: if still exploring, fit to the new focus group; else fit backbone
            if (updatedPath.length > 0) {
              const newFocusId   = updatedPath[updatedPath.length - 1].id;
              const newFocusNode = cy.getElementById(newFocusId);
              if (!newFocusNode.empty()) {
                cy.animate({
                  fit:      { eles: newFocusNode.union(newFocusNode.neighborhood()), padding: 100 },
                  duration: 400,
                  easing:   'ease-in-out-cubic',
                });
              }
            } else {
              const backbone = ntpl_getBackboneNodes(cy);
              if (!backbone.empty()) {
                cy.animate({
                  fit:      { eles: backbone, padding: 80 },
                  duration: 400,
                  easing:   'ease-in-out-cubic',
                });
              }
            }

            setExpanding(false);
          } catch (innerErr) {
            console.error('[ntpl_collapseGroup] Cleanup failed:', innerErr);
            useTopologyStore.getState().setExpanding(false);
          }
        }, 280);
      } catch (error) {
        console.error('[ntpl_collapseGroup] Failed to collapse', groupId, ':', error);
        useTopologyStore.getState().setExpanding(false);
      }
    },
    [getCy],
  );

  // ── Collapse all ─────────────────────────────────────────────────────────

  /**
   * Collapses all expanded groups simultaneously, clears the exploration path,
   * and restores full visibility to the backbone topology.
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

      const {
        expandedGroups,
        collapseAll,
        clearSelection,
        setExpanding,
        clearExplorationPath,
      } = useTopologyStore.getState();

      if (expandedGroups.size === 0) return;

      setExpanding(true);

      const allNodeIds = new Set();
      const allEdgeIds = new Set();

      for (const groupId of expandedGroups) {
        ntpl_getAllDescendantIds(groupId, expandedGroups).forEach((id) => allNodeIds.add(id));
        ntpl_getAllDescendantEdgeIds(groupId, expandedGroups).forEach((id) => allEdgeIds.add(id));
      }

      // Edges disappear immediately
      cy.batch(() => {
        for (const id of allEdgeIds) {
          const ele = cy.getElementById(id);
          if (ele.length > 0) ele.style({ opacity: 0 });
        }
      });

      // Nodes retract toward their parent groups
      for (const groupId of expandedGroups) {
        const groupNode  = cy.getElementById(groupId);
        const retractPos = groupNode.empty() ? { x: 0, y: 0 } : { ...groupNode.position() };
        const childIds   = ntpl_getAllDescendantIds(groupId, expandedGroups);
        for (const id of childIds) {
          const ele = cy.getElementById(id);
          if (ele.length > 0) {
            ele.animate(
              { position: retractPos, style: { opacity: 0 } },
              { duration: 220, easing: 'ease-in-cubic' },
            );
          }
        }
      }

      setTimeout(() => {
        try {
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

          // Restore backbone group positions
          for (const groupId of expandedGroups) {
            const node = cy.getElementById(groupId);
            if (!node.empty()) {
              const savedX = node.data('_savedX');
              const savedY = node.data('_savedY');
              if (savedX != null && savedY != null) {
                node.position({ x: savedX, y: savedY });
              }
            }
          }

          collapseAll();
          clearSelection();
          clearExplorationPath();

          // Remove all focus-mode classes — full visibility restored
          cy.elements().removeClass('context-fade ancestor-dim');

          // Return camera to full backbone view
          const backbone = ntpl_getBackboneNodes(cy);
          if (!backbone.empty()) {
            cy.animate({
              fit:      { eles: backbone, padding: 80 },
              duration: 420,
              easing:   'ease-in-out-cubic',
            });
          }

          setExpanding(false);
        } catch (innerErr) {
          console.error('[ntpl_collapseAllGroups] Cleanup failed:', innerErr);
          useTopologyStore.getState().setExpanding(false);
        }
      }, 280);
    } catch (error) {
      console.error('[ntpl_collapseAllGroups] Failed:', error);
      useTopologyStore.getState().setExpanding(false);
    }
  }, [getCy]);

  // ── Toggle / query ────────────────────────────────────────────────────────

  /**
   * Toggles a group: expands if collapsed, collapses if expanded.
   *
   * Args:
   *   groupId (string): Node ID to toggle.
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
   *   groupId (string): Group node ID to check.
   *
   * Returns:
   *   boolean
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
   * Returns true if the given node ID has expansion data available.
   *
   * Args:
   *   nodeId (string): Node ID to check.
   *
   * Returns:
   *   boolean
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
