import React, { useEffect, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

import { useCytoscapeContext } from '../context/CytoscapeContext';
import useTopologyStore from '../store/topologyStore';
import { cytoscapeStylesheet } from './cytoscapeStylesheet';
import { PHASE1_ELEMENTS } from '../data/topologyData';
import { PHASE1_LAYOUT } from '../layouts/layoutConfigs';

// Register dagre once at module evaluation time (safe — modules eval once)
try { cytoscape.use(dagre); } catch (_) { /* already registered on HMR reload */ }

/**
 * The live Cytoscape graph canvas.
 *
 * Execution order guarantee (React class-in-function tree):
 *   1. CytoscapeComponent.componentDidMount fires → handleCyInit(cy) → setCy(cy)
 *   2. This component's useEffect fires → getCy() is guaranteed non-null
 *
 * Events route through useTopologyStore.getState() to avoid stale closures
 * without needing to re-register listeners on every render.
 */
export default function NetworkGraph() {
  const { setCy, getCy } = useCytoscapeContext();

  // Called by CytoscapeComponent on mount — stores the cy instance and runs layout
  const handleCyInit = useCallback(
    (cy) => {
      setCy(cy);
      cy.layout(PHASE1_LAYOUT).run();
    },
    [setCy],
  );

  // Attach interaction event listeners after mount.
  // cy is available at this point because componentDidMount (class child) fires
  // before the parent function component's useEffect.
  useEffect(() => {
    const cy = getCy();
    if (!cy) return;

    const onNodeTap = (evt) => {
      const node = evt.target;
      useTopologyStore.getState().setSelectedNode(node.id(), node.data());

      cy.elements().addClass('faded');
      const hood = node.closedNeighborhood();
      hood.removeClass('faded').addClass('highlighted');
      node.addClass('selected-node');
    };

    const onEdgeTap = (evt) => {
      const edge = evt.target;
      useTopologyStore.getState().setSelectedEdge(edge.data());

      cy.elements().addClass('faded');
      edge.removeClass('faded').addClass('highlighted');
      edge.source().removeClass('faded').addClass('highlighted');
      edge.target().removeClass('faded').addClass('highlighted');
    };

    const onCanvasTap = (evt) => {
      if (evt.target !== cy) return;
      useTopologyStore.getState().clearSelection();
      cy.elements().removeClass('faded highlighted selected-node');
    };

    cy.on('tap', 'node', onNodeTap);
    cy.on('tap', 'edge', onEdgeTap);
    cy.on('tap',         onCanvasTap);

    return () => {
      cy.removeListener('tap', 'node', onNodeTap);
      cy.removeListener('tap', 'edge', onEdgeTap);
      cy.removeListener('tap',         onCanvasTap);
    };
  // getCy is stable (useCallback with no deps inside CytoscapeContext)
  }, [getCy]);

  return (
    <CytoscapeComponent
      elements={PHASE1_ELEMENTS}
      stylesheet={cytoscapeStylesheet}
      // Pass preset so CytoscapeComponent does not re-run a layout on element
      // identity changes — our layout is driven imperatively in handleCyInit.
      layout={{ name: 'preset' }}
      style={{ width: '100%', height: '100%' }}
      cy={handleCyInit}
      wheelSensitivity={0.25}
      minZoom={0.15}
      maxZoom={3}
      boxSelectionEnabled={false}
    />
  );
}
