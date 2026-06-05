/**
 * Pure topology traversal and graph utility functions.
 * No React, no Cytoscape — all functions operate on plain data structures.
 */

import {
  ALL_EXPANSION_MAP,
  EXPANDABLE_IDS,
  TOP_LEVEL_NODES,
  EXPANSION_MAP,
  DEVICE_EXPANSION_MAP,
  NODE_LEVELS,
} from '../data/topologyData';

// ─── Parent map (child ID → parent ID) ────────────────────────────────────

/**
 * Builds a lookup map from child node ID to its direct parent node ID.
 * Traverses the full three-level hierarchy exactly once.
 *
 * Args:
 *   None
 *
 * Returns:
 *   Map<string, string>: child node ID → parent node ID.
 *
 * Raises:
 *   None — returns empty map on error.
 */
function ntpl_buildParentMap() {
  try {
    const map = new Map();

    const ntpl_processLevel = (expansionSource) => {
      for (const [parentId, entry] of Object.entries(expansionSource)) {
        for (const node of entry.nodes) {
          map.set(node.data.id, parentId);
        }
      }
    };

    ntpl_processLevel(EXPANSION_MAP);
    ntpl_processLevel(DEVICE_EXPANSION_MAP);

    return map;
  } catch (error) {
    console.error('[ntpl_buildParentMap] Failed:', error);
    return new Map();
  }
}

const PARENT_MAP = ntpl_buildParentMap();

// ─── Public utilities ──────────────────────────────────────────────────────

/**
 * Returns the immediate parent ID of a node, or null if it is a root node.
 *
 * Args:
 *   nodeId (string): ID of the node to look up.
 *
 * Returns:
 *   string|null: Parent node ID, or null if the node is top-level.
 *
 * Raises:
 *   None
 */
export function ntpl_getParentId(nodeId) {
  try {
    return PARENT_MAP.get(nodeId) ?? null;
  } catch (error) {
    console.error('[ntpl_getParentId] Error:', error);
    return null;
  }
}

/**
 * Returns the full ancestor chain for a node, from immediate parent to root.
 *
 * Args:
 *   nodeId (string): ID of the node to trace.
 *
 * Returns:
 *   Array<string>: Ordered array [directParent, grandparent, ..., root].
 *
 * Raises:
 *   None — returns empty array on error.
 */
export function ntpl_getAncestors(nodeId) {
  try {
    const chain = [];
    let current = nodeId;
    const visited = new Set();

    while (true) {
      if (visited.has(current)) break;
      visited.add(current);

      const parent = PARENT_MAP.get(current);
      if (!parent) break;

      chain.push(parent);
      current = parent;
    }

    return chain;
  } catch (error) {
    console.error('[ntpl_getAncestors] Error for', nodeId, ':', error);
    return [];
  }
}

/**
 * Returns the ordered expansion path needed to make a node visible.
 * For a device like rtr-core-01, returns ['router-group', 'core-routers'].
 *
 * Args:
 *   nodeId (string): The node to trace.
 *
 * Returns:
 *   Array<string>: Ordered array of group IDs to expand, root-first.
 *
 * Raises:
 *   None — returns empty array on error.
 */
export function ntpl_getExpansionPath(nodeId) {
  try {
    return ntpl_getAncestors(nodeId).reverse();
  } catch (error) {
    console.error('[ntpl_getExpansionPath] Error for', nodeId, ':', error);
    return [];
  }
}

/**
 * Returns a human-readable breadcrumb string for a node.
 *
 * Args:
 *   nodeId    (string): The target node ID.
 *   labelMap  (Map<string,string>): Optional map of id → label overrides.
 *
 * Returns:
 *   string: Breadcrumb like "Router Group > Core Routers > RTR-CORE-01".
 *
 * Raises:
 *   None — returns empty string on error.
 */
export function ntpl_getBreadcrumb(nodeId, labelMap = null) {
  try {
    const ancestors = ntpl_getAncestors(nodeId).reverse();
    const ids = [...ancestors, nodeId];
    return ids
      .map((id) => (labelMap && labelMap.get(id)) || ntpl_idToLabel(id))
      .join(' › ');
  } catch (error) {
    console.error('[ntpl_getBreadcrumb] Error for', nodeId, ':', error);
    return nodeId;
  }
}

/**
 * Converts a node ID to a human-readable label using convention.
 * Falls back to capitalised ID if no rule matches.
 *
 * Args:
 *   id (string): A node ID such as 'rtr-core-01'.
 *
 * Returns:
 *   string: Label such as 'RTR-CORE-01'.
 *
 * Raises:
 *   None
 */
export function ntpl_idToLabel(id) {
  try {
    return id.toUpperCase().replace(/-/g, '-');
  } catch (error) {
    return id;
  }
}

/**
 * Returns all direct children data objects for a given group ID.
 *
 * Args:
 *   groupId (string): The group node ID to look up.
 *
 * Returns:
 *   Array<Object>: Array of child node data objects, or empty array.
 *
 * Raises:
 *   None
 */
export function ntpl_getDirectChildren(groupId) {
  try {
    const entry = ALL_EXPANSION_MAP[groupId];
    if (!entry) return [];
    return entry.nodes.map((n) => n.data);
  } catch (error) {
    console.error('[ntpl_getDirectChildren] Error for', groupId, ':', error);
    return [];
  }
}

/**
 * Returns all descendant node IDs recursively for a group.
 * Used for bulk collapse to identify all nodes to remove.
 *
 * Args:
 *   groupId       (string):   The root group ID.
 *   expandedGroups (Set<string>): Currently expanded groups (to limit traversal).
 *
 * Returns:
 *   Array<string>: All descendant node IDs (all levels).
 *
 * Raises:
 *   None — returns empty array on error.
 */
export function ntpl_getAllDescendantIds(groupId, expandedGroups = new Set()) {
  try {
    const result = [];
    const queue = [groupId];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);

      const entry = ALL_EXPANSION_MAP[current];
      if (!entry) continue;

      for (const node of entry.nodes) {
        result.push(node.data.id);
        // Only recurse into sub-groups that are expanded
        if (expandedGroups.has(node.data.id)) {
          queue.push(node.data.id);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('[ntpl_getAllDescendantIds] Error for', groupId, ':', error);
    return [];
  }
}

/**
 * Returns all descendant edge IDs recursively for a group.
 *
 * Args:
 *   groupId       (string): The root group ID.
 *   expandedGroups (Set<string>): Currently expanded groups.
 *
 * Returns:
 *   Array<string>: All descendant edge IDs.
 *
 * Raises:
 *   None — returns empty array on error.
 */
export function ntpl_getAllDescendantEdgeIds(groupId, expandedGroups = new Set()) {
  try {
    const result = [];
    const queue = [groupId];
    const visited = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);

      const entry = ALL_EXPANSION_MAP[current];
      if (!entry) continue;

      for (const edge of entry.edges) {
        result.push(edge.data.id);
      }
      for (const node of entry.nodes) {
        if (expandedGroups.has(node.data.id)) {
          queue.push(node.data.id);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('[ntpl_getAllDescendantEdgeIds] Error for', groupId, ':', error);
    return [];
  }
}

/**
 * Returns true if a node ID has expansion data (can be double-clicked).
 *
 * Args:
 *   nodeId (string): Node ID to check.
 *
 * Returns:
 *   boolean: True if the node can be expanded.
 *
 * Raises:
 *   None
 */
export function ntpl_isExpandable(nodeId) {
  try {
    return EXPANDABLE_IDS.has(nodeId);
  } catch (error) {
    return false;
  }
}

/**
 * Returns the hierarchy level (0, 1, or 2) of a node.
 *
 * Args:
 *   nodeId (string): The node ID to classify.
 *
 * Returns:
 *   number: 0 for top-group, 1 for sub-group, 2 for device, -1 if unknown.
 *
 * Raises:
 *   None
 */
export function ntpl_getNodeLevel(nodeId) {
  try {
    if (TOP_LEVEL_NODES.some((n) => n.data.id === nodeId)) return NODE_LEVELS.TOP_GROUP;

    for (const entry of Object.values(EXPANSION_MAP)) {
      if (entry.nodes.some((n) => n.data.id === nodeId)) return NODE_LEVELS.SUB_GROUP;
    }

    for (const entry of Object.values(DEVICE_EXPANSION_MAP)) {
      if (entry.nodes.some((n) => n.data.id === nodeId)) return NODE_LEVELS.DEVICE;
    }

    return -1;
  } catch (error) {
    return -1;
  }
}

/**
 * Formats a UTC ISO timestamp to a human-readable relative string.
 *
 * Args:
 *   isoString (string): ISO 8601 date string (e.g., '2026-06-04T08:00:00Z').
 *
 * Returns:
 *   string: Human-readable label like 'just now', '5 min ago', '2 hr ago'.
 *
 * Raises:
 *   None — returns empty string on error.
 */
export function ntpl_formatRelativeTime(isoString) {
  try {
    const now   = Date.now();
    const then  = new Date(isoString).getTime();
    const diffMs = now - then;
    const diffMin = Math.floor(diffMs / 60_000);

    if (diffMin < 1)   return 'just now';
    if (diffMin < 60)  return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24)   return `${diffHr} hr ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  } catch (error) {
    return '';
  }
}
