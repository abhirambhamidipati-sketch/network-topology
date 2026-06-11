import { create } from 'zustand';

/**
 * Central topology application state.
 *
 * Slices:
 *   selection   — selected node / edge
 *   expansion   — which groups are expanded
 *   filters     — node-type visibility toggle map
 *   search      — live search query and results
 *   path        — source/target for path highlighting
 *   focus       — which node is currently centered
 *   loading     — async operation indicators
 *
 * Cytoscape DOM objects are intentionally excluded — those live in
 * CytoscapeContext (a ref) so mutations never trigger React re-renders.
 */
const useTopologyStore = create((set, get) => ({

  // ── Selection ─────────────────────────────────────────────────────────────

  selectedNodeId:   null,
  selectedNodeData: null,
  selectedEdgeData: null,

  /**
   * Record a node selection.
   *
   * Args:
   *   id   (string): Node ID.
   *   data (Object): Full node data object from Cytoscape.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setSelectedNode: (id, data) =>
    set({ selectedNodeId: id, selectedNodeData: data, selectedEdgeData: null }),

  /**
   * Record an edge selection.
   *
   * Args:
   *   data (Object): Full edge data object from Cytoscape.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setSelectedEdge: (data) =>
    set({ selectedNodeId: null, selectedNodeData: null, selectedEdgeData: data }),

  /**
   * Clear the current selection.
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
  clearSelection: () =>
    set({ selectedNodeId: null, selectedNodeData: null, selectedEdgeData: null }),

  // ── Expansion state ───────────────────────────────────────────────────────

  expandedGroups: new Set(),

  /**
   * Mark a group as expanded.
   *
   * Args:
   *   groupId (string): The node ID of the group being expanded.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  expandGroup: (groupId) =>
    set((state) => ({
      expandedGroups: new Set([...state.expandedGroups, groupId]),
    })),

  /**
   * Mark a group as collapsed.
   *
   * Args:
   *   groupId (string): The node ID of the group being collapsed.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  collapseGroup: (groupId) =>
    set((state) => {
      const next = new Set(state.expandedGroups);
      next.delete(groupId);
      return { expandedGroups: next };
    }),

  /**
   * Collapse all expanded groups at once.
   * The corresponding Cytoscape mutations are handled by useExpansionManager.
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
  collapseAll: () =>
    set({ expandedGroups: new Set() }),

  // ── Filters ───────────────────────────────────────────────────────────────

  filters: {
    'cloud-group':    true,
    'vpn-group':      true,
    'firewall-group': true,
    'router-group':   true,
    'switch-group':   true,
    'server-group':   true,
    'laptop-group':   true,
    'desktop-group':  true,
    'mobile-group':   true,
    'guest-group':    true,
  },

  /**
   * Toggle the visibility of a single node type.
   *
   * Args:
   *   typeKey (string): The node type key (e.g. 'router-group').
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  toggleFilter: (typeKey) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [typeKey]: !state.filters[typeKey],
      },
    })),

  /**
   * Set all filter values to a uniform boolean.
   *
   * Args:
   *   value (boolean): True to show all, false to hide all.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setAllFilters: (value) =>
    set((state) => ({
      filters: Object.fromEntries(
        Object.keys(state.filters).map((k) => [k, value]),
      ),
    })),

  // ── Search ────────────────────────────────────────────────────────────────

  searchQuery:    '',
  searchResults:  [],
  isSearchActive: false,

  /**
   * Update the live search query and associated results.
   *
   * Args:
   *   query   (string):        The search string.
   *   results (Array<Object>): Matched search result objects.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setSearchState: (query, results) =>
    set({
      searchQuery:    query,
      searchResults:  results,
      isSearchActive: query.trim().length > 0,
    }),

  /**
   * Clear search state entirely.
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
  clearSearch: () =>
    set({ searchQuery: '', searchResults: [], isSearchActive: false }),

  // ── Path highlighting ─────────────────────────────────────────────────────

  pathSourceId:    null,
  pathTargetId:    null,
  pathElementIds:  [],
  isPathActive:    false,

  /**
   * Set the source node for path tracing.
   *
   * Args:
   *   nodeId (string): Node ID to use as path source.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setPathSource: (nodeId) =>
    set({ pathSourceId: nodeId, pathElementIds: [], isPathActive: false }),

  /**
   * Set the target node for path tracing.
   *
   * Args:
   *   nodeId (string): Node ID to use as path target.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setPathTarget: (nodeId) =>
    set({ pathTargetId: nodeId, pathElementIds: [], isPathActive: false }),

  /**
   * Persist computed path element IDs to state.
   *
   * Args:
   *   elementIds (Array<string>): IDs of all nodes and edges on the path.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setPathResult: (elementIds) =>
    set({ pathElementIds: elementIds, isPathActive: elementIds.length > 0 }),

  /**
   * Clear path state and visual highlighting.
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
  clearPath: () =>
    set({
      pathSourceId:   null,
      pathTargetId:   null,
      pathElementIds: [],
      isPathActive:   false,
    }),

  // ── Focused node ──────────────────────────────────────────────────────────

  focusedNodeId: null,

  /**
   * Set the node ID that the graph should center on.
   *
   * Args:
   *   nodeId (string|null): Node to focus, or null to clear focus.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setFocusedNode: (nodeId) =>
    set({ focusedNodeId: nodeId }),

  // ── Loading / async state ─────────────────────────────────────────────────

  isExpanding:  false,
  isCyReady:    false,
  isDataLoaded: false,

  /**
   * Toggle the expansion loading flag.
   *
   * Args:
   *   value (boolean): True while an expansion or collapse is in progress.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setExpanding: (value) =>
    set({ isExpanding: value }),

  /**
   * Mark the Cytoscape instance as initialised.
   *
   * Args:
   *   value (boolean): True once setCy() has been called.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setCyReady: (value) =>
    set({ isCyReady: value }),

  /**
   * Mark topology data as loaded into the graph.
   *
   * Args:
   *   value (boolean): True once elements have been added to Cytoscape.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setDataLoaded: (value) =>
    set({ isDataLoaded: value }),

  // ── Exploration path (drill-down breadcrumb) ─────────────────────────────
  //
  // Tracks the hierarchy the user has drilled into via expansion.
  // Each item is { id: string, label: string }.
  // Used by TopBar and ntpl_applyFocusMode to drive focus-based LOD rendering.

  explorationPath: [],

  /**
   * Push a newly-expanded group onto the exploration path.
   *
   * Args:
   *   item ({id: string, label: string}): The group being expanded.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  pushExplorationPath: (item) =>
    set((state) => ({ explorationPath: [...state.explorationPath, item] })),

  /**
   * Remove a group and all descendants from the exploration path.
   * Used on single-group collapse: removes `id` and everything after it.
   *
   * Args:
   *   id (string): Group node ID to remove from the path.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  removeFromExplorationPath: (id) =>
    set((state) => {
      const idx = state.explorationPath.findIndex((item) => item.id === id);
      if (idx === -1) return state;
      return { explorationPath: state.explorationPath.slice(0, idx) };
    }),

  /**
   * Reset the exploration path to the top level.
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
  clearExplorationPath: () => set({ explorationPath: [] }),

  // ── Breadcrumb navigation ─────────────────────────────────────────────────

  breadcrumb: [],

  /**
   * Set the breadcrumb trail for the currently selected node.
   *
   * Args:
   *   crumbs (Array<{id: string, label: string}>): Ordered chain from root to selection.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  setBreadcrumb: (crumbs) =>
    set({ breadcrumb: crumbs }),

  /**
   * Clear the breadcrumb trail.
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
  clearBreadcrumb: () =>
    set({ breadcrumb: [] }),
}));

export default useTopologyStore;
