import { useCallback } from 'react';
import { useCytoscapeContext } from '../context/CytoscapeContext';
import useTopologyStore from '../store/topologyStore';
import { ntpl_querySearchIndex } from '../utils/searchUtils';
import { ntpl_getExpansionPath } from '../utils/graphUtils';
import { useExpansionManager } from '../graph/useExpansionManager';

/**
 * Hook providing live search execution and graph-centering for search results.
 *
 * When a search result is selected:
 *   1. The expansion path (ancestor groups) is expanded in order.
 *   2. The target node is centered in the viewport.
 *   3. The node is highlighted (using the same interaction class system).
 *
 * Args:
 *   None (reads CytoscapeContext and useTopologyStore internally)
 *
 * Returns:
 *   Object: { ntpl_handleSearchInput, ntpl_focusSearchResult, ntpl_clearSearch }
 *
 * Raises:
 *   None — all methods log errors and return early on failure.
 */
export function useSearch() {
  const { getCy }                 = useCytoscapeContext();
  const { ntpl_expandGroup }      = useExpansionManager();

  /**
   * Processes a search input change, queries the index, and updates the store.
   *
   * Args:
   *   query (string): Current search input value.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_handleSearchInput = useCallback((query) => {
    try {
      const results = ntpl_querySearchIndex(query, 8);
      useTopologyStore.getState().setSearchState(query, results);
    } catch (error) {
      console.error('[ntpl_handleSearchInput] Failed for query:', query, error);
    }
  }, []);

  /**
   * Clears the search state and removes any search-related graph highlights.
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
  const ntpl_clearSearch = useCallback(() => {
    try {
      useTopologyStore.getState().clearSearch();
      const cy = getCy();
      if (!cy) return;
      cy.elements().removeClass('faded highlighted selected-node');
    } catch (error) {
      console.error('[ntpl_clearSearch] Failed:', error);
    }
  }, [getCy]);

  /**
   * Focuses the graph on a specific search result node.
   * Expands parent groups if needed, then centers and highlights the node.
   *
   * Args:
   *   result (Object): A search index entry with { id, expansionPath }.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None — logs error and returns on failure.
   */
  const ntpl_focusSearchResult = useCallback(
    (result) => {
      try {
        const cy = getCy();
        if (!cy || !result) return;

        // 1. Expand all ancestor groups in order (root → leaf)
        for (const groupId of result.expansionPath) {
          const { expandedGroups } = useTopologyStore.getState();
          if (!expandedGroups.has(groupId)) {
            ntpl_expandGroup(groupId);
          }
        }

        // 2. Wait one microtask for layout to settle, then center and highlight
        setTimeout(() => {
          try {
            const cy2 = getCy();
            if (!cy2) return;

            const node = cy2.getElementById(result.id);
            if (node.empty()) return;

            // Apply selection highlight
            cy2.elements().addClass('faded');
            const hood = node.closedNeighborhood();
            hood.removeClass('faded').addClass('highlighted');
            node.removeClass('faded').addClass('selected-node');

            // Update store selection
            useTopologyStore.getState().setSelectedNode(result.id, node.data());

            // Animate to center on the node
            cy2.animate({
              center:    { eles: node },
              zoom:      Math.max(cy2.zoom(), 1.2),
              duration:  400,
              easing:    'ease-in-out-cubic',
            });

            // Clear search dropdown
            useTopologyStore.getState().clearSearch();
          } catch (innerError) {
            console.error('[ntpl_focusSearchResult] Post-expand centering failed:', innerError);
          }
        }, 650);
      } catch (error) {
        console.error('[ntpl_focusSearchResult] Failed for result:', result?.id, error);
      }
    },
    [getCy, ntpl_expandGroup],
  );

  return {
    ntpl_handleSearchInput,
    ntpl_focusSearchResult,
    ntpl_clearSearch,
  };
}
