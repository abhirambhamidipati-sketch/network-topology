import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';

/**
 * High-level Cytoscape operations consumed by UI controls.
 * All methods are no-ops when the cy instance is not yet mounted.
 */
export function useCytoscape() {
  const { getCy } = useCytoscapeContext();

  const fitGraph = useCallback((padding = 72) => {
    const cy = getCy();
    if (!cy) return;
    cy.fit(undefined, padding);
  }, [getCy]);

  const resetView = useCallback(() => {
    const cy = getCy();
    if (!cy) return;
    cy.fit(undefined, 72);
    cy.center();
  }, [getCy]);

  const zoomIn = useCallback(() => {
    const cy = getCy();
    if (!cy) return;
    cy.zoom({ level: cy.zoom() * 1.25, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  }, [getCy]);

  const zoomOut = useCallback(() => {
    const cy = getCy();
    if (!cy) return;
    cy.zoom({ level: cy.zoom() * 0.8, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
  }, [getCy]);

  /**
   * Highlight a node: fade everything else, emphasise the node and its neighbours.
   */
  const highlightNode = useCallback((nodeId) => {
    const cy = getCy();
    if (!cy) return;

    const node = cy.getElementById(nodeId);
    if (node.empty()) return;

    const neighbourhood = node.closedNeighborhood();

    cy.elements().addClass('faded');
    neighbourhood.removeClass('faded').addClass('highlighted');
    node.removeClass('faded').addClass('highlighted selected-node');
  }, [getCy]);

  /**
   * Remove all highlight/fade classes from the graph.
   */
  const clearHighlight = useCallback(() => {
    const cy = getCy();
    if (!cy) return;
    cy.elements().removeClass('faded highlighted selected-node');
  }, [getCy]);

  /**
   * Run the current layout again (useful after structural changes in Phase 2+).
   */
  const rerunLayout = useCallback((layoutConfig) => {
    const cy = getCy();
    if (!cy) return;
    cy.layout(layoutConfig).run();
  }, [getCy]);

  return {
    fitGraph,
    resetView,
    zoomIn,
    zoomOut,
    highlightNode,
    clearHighlight,
    rerunLayout,
  };
}
