import { create } from 'zustand';

/**
 * Central topology state.
 * Intentionally excludes mutable Cytoscape objects — those live in CytoscapeContext.
 */
const useTopologyStore = create((set) => ({
  // ── Selection ────────────────────────────────────────────────────────────
  selectedNodeId:   null,
  selectedNodeData: null,
  selectedEdgeData: null,

  setSelectedNode: (id, data) =>
    set({ selectedNodeId: id, selectedNodeData: data, selectedEdgeData: null }),

  setSelectedEdge: (data) =>
    set({ selectedNodeId: null, selectedNodeData: null, selectedEdgeData: data }),

  clearSelection: () =>
    set({ selectedNodeId: null, selectedNodeData: null, selectedEdgeData: null }),

  // ── Expansion state ──────────────────────────────────────────────────────
  // Set of group node IDs that are currently expanded
  expandedGroups: new Set(),

  expandGroup: (groupId) =>
    set((state) => ({
      expandedGroups: new Set([...state.expandedGroups, groupId]),
    })),

  collapseGroup: (groupId) =>
    set((state) => {
      const next = new Set(state.expandedGroups);
      next.delete(groupId);
      return { expandedGroups: next };
    }),

  expandAll: () =>
    set((state) => {
      // Populated by Phase 2 — stubbed here so controls work from day one
      return { expandedGroups: new Set(state.expandedGroups) };
    }),

  collapseAll: () =>
    set({ expandedGroups: new Set() }),

  // ── Filters ──────────────────────────────────────────────────────────────
  filters: {
    'cloud-group':   true,
    'router-group':  true,
    'switch-group':  true,
    'server-group':  true,
    'laptop-group':  true,
    'desktop-group': true,
  },

  toggleFilter: (typeKey) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [typeKey]: !state.filters[typeKey],
      },
    })),

  setAllFilters: (value) =>
    set((state) => ({
      filters: Object.fromEntries(Object.keys(state.filters).map((k) => [k, value])),
    })),
}));

export default useTopologyStore;
