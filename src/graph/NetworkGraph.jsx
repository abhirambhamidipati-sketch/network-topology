import React, { useEffect, useCallback, useRef } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { useCytoscapeContext }    from '../context/CytoscapeContext';
import useTopologyStore           from '../store/topologyStore';
import { cytoscapeStylesheet }    from './cytoscapeStylesheet';
import { useExpansionManager }    from './useExpansionManager';
import { useGraphFiltering }      from '../hooks/useGraphFiltering';
import { ntpl_loadBackboneElements } from '../data/topologyLoader';
import { ALL_EXPANSION_MAP }      from '../data/topologyData';
import { PHASE1_LAYOUT }          from '../layouts/layoutConfigs';

try { cytoscape.use(dagre); } catch (_) { /* already registered on HMR */ }

/**
 * The live Cytoscape graph canvas.
 *
 * Responsibilities:
 *   — Mounts an empty CytoscapeComponent, then loads topology data
 *     asynchronously from /topology.json (or built-in fallback) and adds
 *     it imperatively so data loading is decoupled from React rendering.
 *   — Double-tap detection (350 ms window) triggers group expansion/collapse.
 *   — Single-tap selects a node, highlights its neighbourhood, and builds
 *     a breadcrumb trail in the Zustand store for the TopBar to display.
 *   — Hover (mouseover/mouseout) activates a soft focus mode: immediate
 *     neighbours stay visible while the rest of the graph is dimmed, giving
 *     an instant preview of connectivity without requiring a click.
 *   — Subscribes to filter changes and focusedNodeId changes without re-render.
 *
 * Architecture invariant: the `elements` prop is set to [] and NEVER changed.
 * All structural mutations use cy.add() / cy.remove() imperatively.
 *
 * Args:
 *   None
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
export default function NetworkGraph() {
  const { setCy, getCy }              = useCytoscapeContext();
  const { ntpl_toggleGroup }          = useExpansionManager();
  const { ntpl_applyFiltersToGraph }  = useGraphFiltering();

  const lastTapRef     = useRef({ id: null, time: 0 });
  const hoverActiveRef = useRef(false); // tracks whether hover-dim is active

  // ── Initialisation (called once when CytoscapeComponent mounts) ────────────

  /**
   * Stores the cy instance, marks it as ready in the store, then asynchronously
   * loads backbone elements and runs the initial layout.
   *
   * Args:
   *   cy (Object): Live Cytoscape core instance provided by react-cytoscapejs.
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
        useTopologyStore.getState().setCyReady(true);

        ntpl_loadBackboneElements()
          .then((elements) => {
            // Guard 1 — stale cy from React StrictMode unmount/remount cycle:
            // React preserves hook state (including refs) across the simulated
            // unmount, so dataAddedRef would be set to true by the first
            // mount's promise even though cy was destroyed. Comparing the
            // closure's cy to the current active cy detects this cleanly.
            const activeCy = getCy();
            if (!activeCy || activeCy !== cy) return;

            // Guard 2 — HMR double-add: if elements were already loaded into
            // this specific cy instance, skip.
            if (cy.elements().length > 0) return;

            cy.batch(() => { cy.add(elements); });

            const layout = cy.layout(PHASE1_LAYOUT);
            layout.run();

            useTopologyStore.getState().setDataLoaded(true);
          })
          .catch((err) => {
            console.error('[NetworkGraph] Topology data load failed:', err);
          });
      } catch (error) {
        console.error('[ntpl_initCytoscape] Initialisation failed:', error);
      }
    },
    [setCy, getCy],
  );

  // ── Event listeners ────────────────────────────────────────────────────────

  useEffect(() => {
    const cy = getCy();
    if (!cy) return;

    /**
     * Builds a breadcrumb chain for a node by walking up the parentGroup
     * chain stored in each node's data. Stores the result in the Zustand
     * breadcrumb slice so the TopBar can render it reactively.
     *
     * Args:
     *   nodeId (string): ID of the leaf node the user tapped.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_buildAndStoreBreadcrumb = (nodeId) => {
      try {
        const crumbs = [];
        let current  = cy.getElementById(nodeId);

        while (current && !current.empty()) {
          crumbs.unshift({
            id:    current.id(),
            label: current.data('label') || current.id(),
          });
          const parentId = current.data('parentGroup');
          if (!parentId) break;
          current = cy.getElementById(parentId);
        }

        useTopologyStore.getState().setBreadcrumb(crumbs);
      } catch (error) {
        console.error('[ntpl_buildAndStoreBreadcrumb] Error:', error);
      }
    };

    /**
     * Handles a tap on a node.
     *
     * — Double-tap (same node within 350 ms): triggers group expansion/collapse.
     * — Single tap: selects node, highlights its closed neighbourhood,
     *   builds the breadcrumb trail, and cancels any hover-dim state.
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
        const node   = evt.target;
        const nodeId = node.id();
        const now    = Date.now();

        const last         = lastTapRef.current;
        const isDoubleTap  = last.id === nodeId && (now - last.time) < 350;
        lastTapRef.current = { id: nodeId, time: now };

        if (isDoubleTap) {
          ntpl_toggleGroup(nodeId);
          return;
        }

        // Clear hover-dim before applying selection highlight
        if (hoverActiveRef.current) {
          cy.elements().removeClass('hover-dim');
          hoverActiveRef.current = false;
        }

        // Child count from the expansion map (compound API unavailable — no parent field)
        const expansionEntry = ALL_EXPANSION_MAP[nodeId];
        const _childCount    = expansionEntry ? expansionEntry.nodes.length : 0;

        useTopologyStore.getState().setSelectedNode(nodeId, {
          ...node.data(),
          _degree:     node.degree(),
          _childCount,
        });
        ntpl_buildAndStoreBreadcrumb(nodeId);

        cy.elements().addClass('faded');
        const hood = node.closedNeighborhood();
        hood.removeClass('faded').addClass('highlighted');
        node.removeClass('faded highlighted').addClass('selected-node');
      } catch (error) {
        console.error('[ntpl_handleNodeTap] Error:', error);
      }
    };

    /**
     * Handles a tap on an edge.
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
        useTopologyStore.getState().clearBreadcrumb();

        cy.elements().addClass('faded');
        edge.removeClass('faded').addClass('highlighted');
        edge.source().removeClass('faded').addClass('highlighted');
        edge.target().removeClass('faded').addClass('highlighted');
      } catch (error) {
        console.error('[ntpl_handleEdgeTap] Error:', error);
      }
    };

    /**
     * Clears all selection/highlight state when the canvas background is tapped.
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
        useTopologyStore.getState().clearBreadcrumb();
        hoverActiveRef.current = false;
        cy.elements().removeClass(
          'faded highlighted selected-node path-node path-edge hover-dim',
        );
        // Keep context-fade / ancestor-dim — those are set by expansion state,
        // not selection state. Only Collapse All clears them.
      } catch (error) {
        console.error('[ntpl_handleCanvasTap] Error:', error);
      }
    };

    /**
     * Hover focus mode — entry.
     * Dims all graph elements except the hovered node and its direct neighbours.
     * Does not fire when a node is explicitly selected (`.selected-node` is set).
     *
     * Args:
     *   evt (Object): Cytoscape mouseover event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleNodeMouseover = (evt) => {
      try {
        if (cy.nodes('.selected-node').length > 0) return;
        const node = evt.target;
        hoverActiveRef.current = true;
        // hover-dim: 38% opacity — context preserved, neighbourhood emphasised
        cy.elements().addClass('hover-dim');
        node.closedNeighborhood().removeClass('hover-dim');
        node.removeClass('hover-dim');
      } catch (error) {
        console.error('[ntpl_handleNodeMouseover] Error:', error);
      }
    };

    /**
     * Hover focus mode — exit.
     * Restores full visibility when the cursor leaves a node.
     * Does not fire if a node is explicitly selected.
     *
     * Args:
     *   evt (Object): Cytoscape mouseout event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleNodeMouseout = (evt) => {
      try {
        if (cy.nodes('.selected-node').length > 0) return;
        hoverActiveRef.current = false;
        cy.elements().removeClass('hover-dim');
      } catch (error) {
        console.error('[ntpl_handleNodeMouseout] Error:', error);
      }
    };

    cy.on('tap',       'node', ntpl_handleNodeTap);
    cy.on('tap',       'edge', ntpl_handleEdgeTap);
    cy.on('tap',               ntpl_handleCanvasTap);
    cy.on('mouseover', 'node', ntpl_handleNodeMouseover);
    cy.on('mouseout',  'node', ntpl_handleNodeMouseout);

    return () => {
      try {
        cy.removeListener('tap',       'node', ntpl_handleNodeTap);
        cy.removeListener('tap',       'edge', ntpl_handleEdgeTap);
        cy.removeListener('tap',               ntpl_handleCanvasTap);
        cy.removeListener('mouseover', 'node', ntpl_handleNodeMouseover);
        cy.removeListener('mouseout',  'node', ntpl_handleNodeMouseout);
      } catch (error) {
        console.error('[NetworkGraph] Listener cleanup error:', error);
      }
    };
  }, [getCy, ntpl_toggleGroup]);

  // ── Filter sync ────────────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = useTopologyStore.subscribe(
      (state) => state.filters,
      (filters) => {
        try { ntpl_applyFiltersToGraph(filters); }
        catch (error) { console.error('[NetworkGraph] Filter sync error:', error); }
      },
    );
    return unsub;
  }, [ntpl_applyFiltersToGraph]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────

  useEffect(() => {
    /**
     * Global keyboard shortcut handler.
     *
     * Shortcuts:
     *   F           — fit all nodes in viewport
     *   R           — animated reset view
     *   Escape      — clear selection and all highlight classes
     *   Ctrl/Cmd+F  — focus the search input
     *
     * Args:
     *   e (KeyboardEvent): Native keyboard event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleKeyDown = (e) => {
      try {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        const cy = getCy();
        if (!cy) return;

        if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
          e.preventDefault();
          const searchInput = document.querySelector('.search__input');
          if (searchInput) searchInput.focus();
          return;
        }

        switch (e.key) {
          case 'f':
          case 'F':
            cy.fit(undefined, 72);
            break;
          case 'r':
          case 'R':
            cy.animate({ fit: { eles: cy.elements(), padding: 72 }, duration: 350, easing: 'ease-in-out' });
            break;
          case 'Escape':
            useTopologyStore.getState().clearSelection();
            useTopologyStore.getState().clearBreadcrumb();
            // Clear selection/hover classes only; context-fade/ancestor-dim are
            // owned by expansion state and must not be cleared here.
            cy.elements().removeClass(
              'faded highlighted selected-node path-node path-edge hover-dim',
            );
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('[NetworkGraph] Keyboard shortcut error:', error);
      }
    };

    document.addEventListener('keydown', ntpl_handleKeyDown);
    return () => document.removeEventListener('keydown', ntpl_handleKeyDown);
  }, [getCy]);

  // ── Focus node (search navigation + breadcrumb click) ─────────────────────

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
            zoom:     Math.max(cy.zoom(), 1.4),
            duration: 420,
            easing:   'ease-in-out-cubic',
          });
          // Pulse selection highlight
          cy.elements().addClass('faded');
          node.closedNeighborhood().removeClass('faded').addClass('highlighted');
          node.removeClass('faded highlighted').addClass('selected-node');
        } catch (error) {
          console.error('[NetworkGraph] Focus effect error:', error);
        }
      },
    );
    return unsub;
  }, [getCy]);

  return (
    <CytoscapeComponent
      elements={[]}
      stylesheet={cytoscapeStylesheet}
      layout={{ name: 'preset' }}
      style={{ width: '100%', height: '100%', backgroundColor: '#0F172A' }}
      cy={ntpl_initCytoscape}
      wheelSensitivity={0.25}
      minZoom={0.08}
      maxZoom={4}
      boxSelectionEnabled={false}
    />
  );
}
