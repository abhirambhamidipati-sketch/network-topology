import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';
import useTopologyStore from '../store/topologyStore';

/**
 * Hook providing shortest-path computation and visual highlighting.
 *
 * Algorithm: Cytoscape's built-in aStar algorithm on the currently visible
 * (display:element) undirected graph. The path is rendered by applying
 * .path-node / .path-edge classes; everything else is faded.
 *
 * Args:
 *   None (reads CytoscapeContext and useTopologyStore internally)
 *
 * Returns:
 *   Object: { ntpl_computeAndHighlightPath, ntpl_clearPathHighlight,
 *             ntpl_setPathSource, ntpl_setPathTarget }
 *
 * Raises:
 *   None — all methods log errors and return early on failure.
 */
export function usePathHighlighter() {
  const { getCy } = useCytoscapeContext();

  /**
   * Clears all path-related visual classes from the graph.
   *
   * Args:
   *   None
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_clearPathHighlight = useCallback(() => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.elements().removeClass('path-node path-edge faded');
      useTopologyStore.getState().clearPath();
    } catch (error) {
      console.error('[ntpl_clearPathHighlight] Failed:', error);
    }
  }, [getCy]);

  /**
   * Computes the shortest path between two nodes and highlights it.
   * If no path exists, shows a notification state in the store.
   *
   * Args:
   *   sourceId (string): Starting node ID.
   *   targetId (string): Destination node ID.
   *
   * Returns:
   *   boolean: True if path was found and highlighted, false otherwise.
   *
   * Raises:
   *   None — logs error and returns false on failure.
   */
  const ntpl_computeAndHighlightPath = useCallback(
    (sourceId, targetId) => {
      try {
        const cy = getCy();
        if (!cy) return false;

        if (!sourceId || !targetId || sourceId === targetId) {
          console.warn('[ntpl_computeAndHighlightPath] Invalid source/target:', sourceId, targetId);
          return false;
        }

        const sourceNode = cy.getElementById(sourceId);
        const targetNode = cy.getElementById(targetId);

        if (sourceNode.empty() || targetNode.empty()) {
          console.warn('[ntpl_computeAndHighlightPath] One or both nodes not in graph:', sourceId, targetId);
          return false;
        }

        // Use only visible elements for path computation
        const visibleEles = cy.elements().filter((ele) => ele.style('display') !== 'none');

        const result = visibleEles.aStar({
          root:     sourceNode,
          goal:     targetNode,
          directed: false,
        });

        if (!result.found) {
          useTopologyStore.getState().setPathResult([]);
          return false;
        }

        const pathElements = result.path;
        const pathIds = pathElements.map((ele) => ele.id());

        // Apply visual classes
        cy.elements().removeClass('path-node path-edge');
        cy.elements().addClass('faded');
        pathElements.forEach((ele) => {
          ele.removeClass('faded');
          if (ele.isNode()) ele.addClass('path-node');
          if (ele.isEdge()) ele.addClass('path-edge');
        });

        useTopologyStore.getState().setPathResult(pathIds);
        return true;
      } catch (error) {
        console.error('[ntpl_computeAndHighlightPath] Failed:', error);
        return false;
      }
    },
    [getCy],
  );

  /**
   * Sets the path source to the currently selected node ID in the store.
   *
   * Args:
   *   nodeId (string): Node ID to set as the path source.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_setPathSource = useCallback((nodeId) => {
    try {
      useTopologyStore.getState().setPathSource(nodeId);
      ntpl_clearPathHighlight();
    } catch (error) {
      console.error('[ntpl_setPathSource] Error:', error);
    }
  }, [ntpl_clearPathHighlight]);

  /**
   * Sets the path target node ID in the store.
   *
   * Args:
   *   nodeId (string): Node ID to set as the path target.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_setPathTarget = useCallback((nodeId) => {
    try {
      useTopologyStore.getState().setPathTarget(nodeId);
      ntpl_clearPathHighlight();
    } catch (error) {
      console.error('[ntpl_setPathTarget] Error:', error);
    }
  }, [ntpl_clearPathHighlight]);

  return {
    ntpl_computeAndHighlightPath,
    ntpl_clearPathHighlight,
    ntpl_setPathSource,
    ntpl_setPathTarget,
  };
}
