import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';

/**
 * High-level Cytoscape viewport and graph operations.
 *
 * All methods are no-ops when the cy instance is not yet mounted.
 * Each operation wraps its Cytoscape call in try/catch so that layout
 * races or missing-node IDs never propagate as unhandled exceptions.
 *
 * Args:
 *   None (reads CytoscapeContext)
 *
 * Returns:
 *   Object: viewport and graph interaction functions
 *
 * Raises:
 *   None
 */
export function useCytoscape() {
  const { getCy } = useCytoscapeContext();

  /**
   * Fits all visible nodes in view with padding.
   *
   * Args:
   *   padding (number): Pixel padding around the fitted bounding box (default 72).
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_fitGraph = useCallback((padding = 72) => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.fit(undefined, padding);
    } catch (error) {
      console.error('[ntpl_fitGraph] Error:', error);
    }
  }, [getCy]);

  /**
   * Resets pan and zoom to the default fitted view.
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
  const ntpl_resetView = useCallback(() => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.animate({ fit: { eles: cy.elements(), padding: 72 }, duration: 350, easing: 'ease-in-out' });
    } catch (error) {
      console.error('[ntpl_resetView] Error:', error);
    }
  }, [getCy]);

  /**
   * Zooms in by 25% toward the canvas center.
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
  const ntpl_zoomIn = useCallback(() => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.zoom({
        level:            cy.zoom() * 1.25,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    } catch (error) {
      console.error('[ntpl_zoomIn] Error:', error);
    }
  }, [getCy]);

  /**
   * Zooms out by 20% from the canvas center.
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
  const ntpl_zoomOut = useCallback(() => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.zoom({
        level:            cy.zoom() * 0.8,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      });
    } catch (error) {
      console.error('[ntpl_zoomOut] Error:', error);
    }
  }, [getCy]);

  /**
   * Centers and zooms the viewport to a specific node.
   *
   * Args:
   *   nodeId  (string): ID of the node to center on.
   *   zoom    (number): Target zoom level (default 1.4).
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_centerNode = useCallback((nodeId, zoom = 1.4) => {
    try {
      const cy = getCy();
      if (!cy || !nodeId) return;
      const node = cy.getElementById(nodeId);
      if (node.empty()) return;
      cy.animate({
        center:   { eles: node },
        zoom:     Math.max(cy.zoom(), zoom),
        duration: 400,
        easing:   'ease-in-out-cubic',
      });
    } catch (error) {
      console.error('[ntpl_centerNode] Error for', nodeId, ':', error);
    }
  }, [getCy]);

  /**
   * Isolates a node by fading all elements outside its neighbourhood.
   *
   * Args:
   *   nodeId (string): ID of the node to isolate.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_isolateNode = useCallback((nodeId) => {
    try {
      const cy = getCy();
      if (!cy || !nodeId) return;
      const node = cy.getElementById(nodeId);
      if (node.empty()) return;
      const neighbourhood = node.closedNeighborhood();
      cy.elements().addClass('faded');
      neighbourhood.removeClass('faded').addClass('highlighted');
      node.removeClass('faded highlighted').addClass('selected-node');
    } catch (error) {
      console.error('[ntpl_isolateNode] Error for', nodeId, ':', error);
    }
  }, [getCy]);

  /**
   * Highlights a node and its direct neighbourhood, fading all others.
   *
   * Args:
   *   nodeId (string): ID of the node to highlight.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_highlightNode = useCallback((nodeId) => {
    try {
      const cy = getCy();
      if (!cy || !nodeId) return;
      const node = cy.getElementById(nodeId);
      if (node.empty()) return;
      const neighbourhood = node.closedNeighborhood();
      cy.elements().addClass('faded');
      neighbourhood.removeClass('faded').addClass('highlighted');
      node.removeClass('faded').addClass('highlighted selected-node');
    } catch (error) {
      console.error('[ntpl_highlightNode] Error for', nodeId, ':', error);
    }
  }, [getCy]);

  /**
   * Removes all highlight/fade/selection classes from every element.
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
  const ntpl_clearHighlight = useCallback(() => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.elements().removeClass('faded highlighted selected-node path-node path-edge');
    } catch (error) {
      console.error('[ntpl_clearHighlight] Error:', error);
    }
  }, [getCy]);

  /**
   * Runs a specified layout configuration on all current graph elements.
   * Used after programmatic structural changes (expansion, collapse).
   *
   * Args:
   *   layoutConfig (Object): A Cytoscape layout configuration object.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_rerunLayout = useCallback((layoutConfig) => {
    try {
      const cy = getCy();
      if (!cy) return;
      cy.layout(layoutConfig).run();
    } catch (error) {
      console.error('[ntpl_rerunLayout] Error:', error);
    }
  }, [getCy]);

  return {
    ntpl_fitGraph,
    ntpl_resetView,
    ntpl_zoomIn,
    ntpl_zoomOut,
    ntpl_centerNode,
    ntpl_isolateNode,
    ntpl_highlightNode,
    ntpl_clearHighlight,
    ntpl_rerunLayout,
    // Backwards-compat aliases (used by GraphControls)
    fitGraph:     (p) => ntpl_fitGraph(p),
    resetView:    ()  => ntpl_resetView(),
    zoomIn:       ()  => ntpl_zoomIn(),
    zoomOut:      ()  => ntpl_zoomOut(),
    centerNode:   (id) => ntpl_centerNode(id),
    clearHighlight: () => ntpl_clearHighlight(),
  };
}
