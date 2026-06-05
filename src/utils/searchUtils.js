/**
 * Search index construction and query execution.
 * Provides live prefix/fuzzy matching across the full topology hierarchy.
 * No React, no Cytoscape — operates on plain topology data only.
 */

import { ntpl_getAllNodes } from '../data/topologyData';
import { ntpl_getBreadcrumb, ntpl_getExpansionPath } from './graphUtils';
import { TYPE_LABELS } from '../data/topologyData';

// ─── Search index entry schema ─────────────────────────────────────────────
//
// {
//   id          : string   — node ID
//   label       : string   — display label
//   type        : string   — NODE_TYPES value
//   typeLabel   : string   — human-readable type
//   level       : number   — 0|1|2
//   ip          : string   — IP address or subnet
//   region      : string   — geographic region
//   role        : string   — device role
//   description : string   — meta.description
//   breadcrumb  : string   — "Cloud › AWS"
//   expansionPath : string[] — groups to expand to reach this node
//   searchText  : string   — lowercased concatenation for fast matching
// }

let _cachedIndex = null;

/**
 * Builds and caches the full searchable index from all topology nodes.
 * Subsequent calls return the cached instance.
 *
 * Args:
 *   None
 *
 * Returns:
 *   Array<Object>: Flat array of search index entries.
 *
 * Raises:
 *   None — returns empty array on error.
 */
export function ntpl_buildSearchIndex() {
  try {
    if (_cachedIndex) return _cachedIndex;

    const allNodes = ntpl_getAllNodes();
    const labelMap = new Map(allNodes.map((n) => [n.id, n.label?.replace(/\n/g, ' ')]));

    _cachedIndex = allNodes.map((node) => {
      const label       = (node.label || '').replace(/\n/g, ' ');
      const typeLabel   = TYPE_LABELS[node.type] || node.type;
      const ip          = node.meta?.ip || '';
      const region      = node.meta?.region || '';
      const role        = node.meta?.role || '';
      const description = node.meta?.description || '';
      const breadcrumb  = ntpl_getBreadcrumb(node.id, labelMap);
      const expansionPath = ntpl_getExpansionPath(node.id);

      const searchText = [
        label,
        node.id,
        typeLabel,
        ip,
        region,
        role,
        description,
        breadcrumb,
      ]
        .join(' ')
        .toLowerCase();

      return {
        id:            node.id,
        label,
        type:          node.type,
        typeLabel,
        level:         node.level,
        ip,
        region,
        role,
        description,
        breadcrumb,
        expansionPath,
        searchText,
      };
    });

    return _cachedIndex;
  } catch (error) {
    console.error('[ntpl_buildSearchIndex] Failed to build search index:', error);
    return [];
  }
}

/**
 * Clears the search index cache. Call after topology data changes.
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
export function ntpl_invalidateSearchIndex() {
  _cachedIndex = null;
}

/**
 * Executes a search query against the pre-built index.
 * Returns ranked results: exact label matches first, then prefix, then substring.
 *
 * Args:
 *   query    (string): User input string.
 *   maxResults (number): Maximum number of results to return (default 8).
 *
 * Returns:
 *   Array<Object>: Sorted array of matching search index entries.
 *
 * Raises:
 *   None — returns empty array on error or empty query.
 */
export function ntpl_querySearchIndex(query, maxResults = 8) {
  try {
    const trimmed = (query || '').trim();
    if (trimmed.length === 0) return [];

    const index = ntpl_buildSearchIndex();
    const q     = trimmed.toLowerCase();

    const scored = [];

    for (const entry of index) {
      const label = entry.label.toLowerCase();
      const id    = entry.id.toLowerCase();

      let score = 0;

      if (label === q || id === q)              score = 100;  // exact match
      else if (label.startsWith(q))             score = 80;   // label prefix
      else if (id.startsWith(q))               score = 70;   // id prefix
      else if (entry.ip.startsWith(q))         score = 65;   // IP prefix
      else if (entry.searchText.includes(q))   score = 40;   // substring

      if (score > 0) scored.push({ entry, score });
    }

    return scored
      .sort((a, b) => b.score - a.score || a.entry.level - b.entry.level)
      .slice(0, maxResults)
      .map((s) => s.entry);
  } catch (error) {
    console.error('[ntpl_querySearchIndex] Query failed for:', query, error);
    return [];
  }
}

/**
 * Returns the segments of a label with the matching portion annotated.
 * Used to bold the matching text in search result UI.
 *
 * Args:
 *   text  (string): The full label text.
 *   query (string): The search query.
 *
 * Returns:
 *   Array<{text: string, match: boolean}>: Annotated text segments.
 *
 * Raises:
 *   None — returns un-annotated single segment on error.
 */
export function ntpl_annotateMatch(text, query) {
  try {
    if (!query || !text) return [{ text, match: false }];

    const q     = query.trim().toLowerCase();
    const lower = text.toLowerCase();
    const idx   = lower.indexOf(q);

    if (idx === -1) return [{ text, match: false }];

    return [
      { text: text.slice(0, idx),            match: false },
      { text: text.slice(idx, idx + q.length), match: true },
      { text: text.slice(idx + q.length),    match: false },
    ].filter((s) => s.text.length > 0);
  } catch (error) {
    return [{ text, match: false }];
  }
}
