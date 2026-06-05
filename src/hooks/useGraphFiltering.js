import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';
import useTopologyStore from '../store/topologyStore';
import { NODE_TYPES } from '../data/topologyData';

/**
 * Maps a top-level filter key (e.g. 'router-group') to all node type strings
 * that belong to that family. When a filter is toggled off, every descendant
 * type in the family is also hidden.
 */
const FILTER_TYPE_FAMILIES = {
  'cloud-group':   [NODE_TYPES.CLOUD_GROUP,   NODE_TYPES.CLOUD_PROVIDER],
  'router-group':  [NODE_TYPES.ROUTER_GROUP,  NODE_TYPES.ROUTER_SUBGROUP,  NODE_TYPES.ROUTER],
  'switch-group':  [NODE_TYPES.SWITCH_GROUP,  NODE_TYPES.SWITCH_SUBGROUP,  NODE_TYPES.SWITCH],
  'server-group':  [NODE_TYPES.SERVER_GROUP,  NODE_TYPES.SERVER_SUBGROUP,  NODE_TYPES.SERVER],
  'laptop-group':  [NODE_TYPES.LAPTOP_GROUP,  NODE_TYPES.REGION_GROUP,     NODE_TYPES.LAPTOP],
  'desktop-group': [NODE_TYPES.DESKTOP_GROUP, NODE_TYPES.REGION_GROUP,     NODE_TYPES.DESKTOP],
};

/**
 * Hook that applies Zustand filter state to the live Cytoscape graph.
 * Uses Cytoscape's `display` style property ('element' | 'none') to show/hide
 * nodes and their connected edges without removing them from the graph.
 *
 * Args:
 *   None (reads CytoscapeContext and useTopologyStore internally)
 *
 * Returns:
 *   Object: { ntpl_applyFiltersToGraph, ntpl_syncFiltersFromStore }
 *
 * Raises:
 *   None — all methods log errors and return early on failure.
 */
export function useGraphFiltering() {
  const { getCy } = useCytoscapeContext();

  /**
   * Applies the full current filter map to the Cytoscape graph.
   * All nodes of hidden families are set to display:none; their edges
   * follow automatically through Cytoscape's edge-visibility rules.
   *
   * Args:
   *   filters (Object): Map of filterKey → boolean from the store.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error and returns on failure.
   */
  const ntpl_applyFiltersToGraph = useCallback(
    (filters) => {
      try {
        const cy = getCy();
        if (!cy) return;

        cy.batch(() => {
          // Reset all nodes to visible
          cy.nodes().style('display', 'element');

          // Hide nodes belonging to disabled filter families
          for (const [filterKey, isVisible] of Object.entries(filters)) {
            if (isVisible) continue;

            const types = FILTER_TYPE_FAMILIES[filterKey];
            if (!types) continue;

            for (const type of types) {
              cy.nodes(`[type="${type}"]`).style('display', 'none');
            }
          }

          // Hide edges whose source or target is hidden
          cy.edges().forEach((edge) => {
            const srcVisible = edge.source().style('display') !== 'none';
            const tgtVisible = edge.target().style('display') !== 'none';
            edge.style('display', srcVisible && tgtVisible ? 'element' : 'none');
          });
        });
      } catch (error) {
        console.error('[ntpl_applyFiltersToGraph] Failed:', error);
      }
    },
    [getCy],
  );

  /**
   * Reads the current filter state from the store and applies it to the graph.
   * Convenience wrapper for use in effects that subscribe to filter changes.
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
  const ntpl_syncFiltersFromStore = useCallback(() => {
    try {
      const { filters } = useTopologyStore.getState();
      ntpl_applyFiltersToGraph(filters);
    } catch (error) {
      console.error('[ntpl_syncFiltersFromStore] Failed:', error);
    }
  }, [ntpl_applyFiltersToGraph]);

  /**
   * Toggles a single filter type and immediately syncs to the graph.
   *
   * Args:
   *   typeKey (string): Filter family key (e.g. 'server-group').
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_toggleFilterAndSync = useCallback(
    (typeKey) => {
      try {
        useTopologyStore.getState().toggleFilter(typeKey);
        const { filters } = useTopologyStore.getState();
        ntpl_applyFiltersToGraph(filters);
      } catch (error) {
        console.error('[ntpl_toggleFilterAndSync] Failed for', typeKey, ':', error);
      }
    },
    [ntpl_applyFiltersToGraph],
  );

  return {
    ntpl_applyFiltersToGraph,
    ntpl_syncFiltersFromStore,
    ntpl_toggleFilterAndSync,
  };
}
