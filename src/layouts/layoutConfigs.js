/**
 * Cytoscape layout configurations for all graph states.
 *
 * Layout tiers:
 *   PHASE1_LAYOUT   — initial 6-node backbone view (dagre TB)
 *   EXPANDED_LAYOUT — full hierarchy with compound parent containers
 *   DEVICE_LAYOUT   — tighter spacing for dense device-level graphs
 *   FALLBACK_LAYOUT — breadthfirst (built-in, no plugin required)
 */

/**
 * Initial Phase 1 layout: 6 top-level group nodes in a clean top-to-bottom DAG.
 */
export const PHASE1_LAYOUT = {
  name:              'dagre',
  rankDir:           'TB',
  rankSep:           140,
  nodeSep:           110,
  edgeSep:           20,
  padding:           50,
  fit:               true,
  animate:           true,
  animationDuration: 550,
  animationEasing:   'ease-out',
};

/**
 * Used after first-level group expansion (sub-groups visible).
 * Slightly tighter than Phase 1 to handle more nodes gracefully.
 */
export const EXPANDED_LAYOUT = {
  name:              'dagre',
  rankDir:           'TB',
  rankSep:           130,
  nodeSep:           100,
  edgeSep:           20,
  padding:           56,
  fit:               true,
  animate:           true,
  animationDuration: 550,
  animationEasing:   'ease-in-out',
};

/**
 * Compact layout for device-level expansions where many leaf nodes appear.
 */
export const DEVICE_LAYOUT = {
  name:              'dagre',
  rankDir:           'TB',
  rankSep:           90,
  nodeSep:           64,
  edgeSep:           14,
  padding:           50,
  fit:               true,
  animate:           true,
  animationDuration: 450,
  animationEasing:   'ease-in-out',
};

/**
 * Breadth-first fallback — built into Cytoscape, no plugin required.
 * Activated if dagre plugin is unavailable or throws.
 */
export const FALLBACK_LAYOUT = {
  name:            'breadthfirst',
  directed:        true,
  spacingFactor:   2.0,
  padding:         80,
  fit:             true,
  animate:         true,
  animationDuration: 400,
};

/**
 * Selects the appropriate layout config based on the maximum expansion level
 * currently active in the graph.
 *
 * Args:
 *   maxLevel (number): Highest node level currently visible (0, 1, or 2).
 *
 * Returns:
 *   Object: Cytoscape layout configuration.
 *
 * Raises:
 *   None
 */
export function ntpl_selectLayout(maxLevel) {
  try {
    if (maxLevel >= 2) return DEVICE_LAYOUT;
    if (maxLevel >= 1) return EXPANDED_LAYOUT;
    return PHASE1_LAYOUT;
  } catch (error) {
    console.error('[ntpl_selectLayout] Falling back to PHASE1_LAYOUT:', error);
    return PHASE1_LAYOUT;
  }
}
