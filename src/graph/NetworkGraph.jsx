import React, { useEffect, useCallback, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { useCytoscapeContext }    from '../context/CytoscapeContext';
import useTopologyStore           from '../store/topologyStore';
import { cytoscapeStylesheet }    from './cytoscapeStylesheet';
import { useExpansionManager }    from './useExpansionManager';
import { useGraphFiltering }      from '../hooks/useGraphFiltering';
import { PHASE1_ELEMENTS }        from '../data/topologyData';
import { PHASE1_LAYOUT }          from '../layouts/layoutConfigs';

// Register dagre once at module evaluation time.
// Try/catch guards against hot-module-reload double-registration.
try { cytoscape.use(dagre); } catch (_) { /* already registered */ }

/**
 * The live Cytoscape graph canvas.
 *
 * Responsibilities:
 *   — Renders all visible topology nodes and edges via Cytoscape.
 *   — Handles single-click (node selection) and double-click (group expansion).
 *   — Wires Zustand filter changes to the cy display property.
 *   — Wires Zustand focusedNodeId changes to viewport centering.
 *
 * Architecture invariant: the `elements` prop is set once at mount from
 * PHASE1_ELEMENTS and NEVER updated. All subsequent structural mutations
 * (expansion, collapse, filter hide/show) are applied imperatively via
 * cy.add() / cy.remove() / cy.style() to avoid CytoscapeComponent's
 * reconciliation interfering with our imperative model.
 *
 * Args:
 *   None
 *
 * Returns:
 *   JSX.Element: The CytoscapeComponent canvas.
 *
 * Raises:
 *   None
 */
export default function NetworkGraph() {
  const { setCy, getCy }              = useCytoscapeContext();
  const { ntpl_toggleGroup }          = useExpansionManager();
  const { ntpl_applyFiltersToGraph }  = useGraphFiltering();

  // Track last tap time per node for double-click detection
  const lastTapRef = useRef({ id: null, time: 0 });

  /**
   * Called by CytoscapeComponent on mount.
   * Stores the cy instance and runs the initial layout.
   *
   * Args:
   *   cy (Object): Live Cytoscape core instance.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_initCytoscape = useCallback(
    (cy) => {
      try {
        setCy(cy);
        cy.layout(PHASE1_LAYOUT).run();
      } catch (error) {
        console.error('[ntpl_initCytoscape] Initialisation failed:', error);
      }
    },
    [setCy],
  );

  // ── Event listeners ────────────────────────────────────────────────────────
  useEffect(() => {
    const cy = getCy();
    if (!cy) return;

    /**
     * Handles a tap on a node: selects it and highlights its neighbourhood.
     * Also detects double-taps (within 350ms) to trigger group expansion.
     *
     * Args:
     *   evt (Object): Cytoscape tap event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleNodeTap = (evt) => {
      try {
        const node = evt.target;
        const nodeId = node.id();
        const now = Date.now();

        // Double-tap detection: same node within 350ms
        const last = lastTapRef.current;
        const isDoubleTap = last.id === nodeId && (now - last.time) < 350;
        lastTapRef.current = { id: nodeId, time: now };

        if (isDoubleTap) {
          // Double-tap → expand/collapse if expandable
          ntpl_toggleGroup(nodeId);
          return;
        }

        // Single tap → select node and highlight neighbourhood
        useTopologyStore.getState().setSelectedNode(nodeId, node.data());

        cy.elements().addClass('faded');
        const hood = node.closedNeighborhood();
        hood.removeClass('faded').addClass('highlighted');
        node.removeClass('faded highlighted').addClass('selected-node');
      } catch (error) {
        console.error('[ntpl_handleNodeTap] Error:', error);
      }
    };

    /**
     * Handles a tap on an edge: selects it and highlights connected nodes.
     *
     * Args:
     *   evt (Object): Cytoscape tap event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleEdgeTap = (evt) => {
      try {
        const edge = evt.target;
        useTopologyStore.getState().setSelectedEdge(edge.data());

        cy.elements().addClass('faded');
        edge.removeClass('faded').addClass('highlighted');
        edge.source().removeClass('faded').addClass('highlighted');
        edge.target().removeClass('faded').addClass('highlighted');
      } catch (error) {
        console.error('[ntpl_handleEdgeTap] Error:', error);
      }
    };

    /**
     * Handles a tap on the canvas background: clears all selection/highlight state.
     *
     * Args:
     *   evt (Object): Cytoscape tap event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleCanvasTap = (evt) => {
      try {
        if (evt.target !== cy) return;
        useTopologyStore.getState().clearSelection();
        cy.elements().removeClass('faded highlighted selected-node path-node path-edge');
      } catch (error) {
        console.error('[ntpl_handleCanvasTap] Error:', error);
      }
    };

    cy.on('tap', 'node', ntpl_handleNodeTap);
    cy.on('tap', 'edge', ntpl_handleEdgeTap);
    cy.on('tap',         ntpl_handleCanvasTap);

    return () => {
      try {
        cy.removeListener('tap', 'node', ntpl_handleNodeTap);
        cy.removeListener('tap', 'edge', ntpl_handleEdgeTap);
        cy.removeListener('tap',         ntpl_handleCanvasTap);
      } catch (error) {
        console.error('[NetworkGraph] Listener cleanup error:', error);
      }
    };
  }, [getCy, ntpl_toggleGroup]);

  // ── Filter sync effect ─────────────────────────────────────────────────────
  // Subscribe to filter state changes and apply them to the graph immediately.
  useEffect(() => {
    const unsub = useTopologyStore.subscribe(
      (state) => state.filters,
      (filters) => {
        try {
          ntpl_applyFiltersToGraph(filters);
        } catch (error) {
          console.error('[NetworkGraph] Filter sync error:', error);
        }
      },
    );
    return unsub;
  }, [ntpl_applyFiltersToGraph]);

  // ── Focus node effect ──────────────────────────────────────────────────────
  // When focusedNodeId changes in the store, animate the viewport to that node.
  useEffect(() => {
    const unsub = useTopologyStore.subscribe(
      (state) => state.focusedNodeId,
      (nodeId) => {
        try {
          if (!nodeId) return;
          const cy = getCy();
          if (!cy) return;
          const node = cy.getElementById(nodeId);
          if (node.empty()) return;
          cy.animate({
            center:   { eles: node },
            zoom:     Math.max(cy.zoom(), 1.2),
            duration: 400,
            easing:   'ease-in-out-cubic',
          });
        } catch (error) {
          console.error('[NetworkGraph] Focus effect error:', error);
        }
      },
    );
    return unsub;
  }, [getCy]);

  return (
    <CytoscapeComponent
      elements={PHASE1_ELEMENTS}
      stylesheet={cytoscapeStylesheet}
      layout={{ name: 'preset' }}
      style={{ width: '100%', height: '100%' }}
      cy={ntpl_initCytoscape}
      wheelSensitivity={0.25}
      minZoom={0.1}
      maxZoom={4}
      boxSelectionEnabled={false}
    />
  );
}
