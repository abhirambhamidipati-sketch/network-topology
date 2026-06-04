/**
 * Cytoscape layout configurations.
 *
 * PHASE1_LAYOUT uses dagre (top-to-bottom DAG) for the backbone topology.
 * Future layouts (for expanded sub-graphs, overview, etc.) are stubs here
 * so Phase 2 only needs to pick one rather than define from scratch.
 */

export const PHASE1_LAYOUT = {
  name: 'dagre',
  rankDir: 'TB',       // top → bottom
  rankSep: 110,        // vertical gap between levels
  nodeSep: 80,         // horizontal gap between siblings
  edgeSep: 20,
  padding: 80,
  fit: true,
  animate: true,
  animationDuration: 400,
  animationEasing: 'ease-out',
};

/**
 * Used when re-running layout after expansion in Phase 2.
 * Slightly tighter spacing to handle more nodes.
 */
export const EXPANDED_LAYOUT = {
  name: 'dagre',
  rankDir: 'TB',
  rankSep: 90,
  nodeSep: 60,
  edgeSep: 15,
  padding: 60,
  fit: true,
  animate: true,
  animationDuration: 500,
  animationEasing: 'ease-in-out',
};

/**
 * Breadth-first fallback — built into Cytoscape, no plugin required.
 * Useful if dagre plugin is unavailable.
 */
export const FALLBACK_LAYOUT = {
  name: 'breadthfirst',
  directed: true,
  spacingFactor: 2.0,
  padding: 80,
  fit: true,
  animate: true,
  animationDuration: 400,
};
