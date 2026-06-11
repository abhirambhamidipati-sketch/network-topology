/**
 * Dynamic topology loader — QWERTY Corporation Network Topology Explorer.
 *
 * Loading priority for backbone elements:
 *   1. /topology.json  (public folder or future backend API endpoint)
 *   2. Built-in topologyData.js (always-available fallback)
 *
 * The expansion maps (EXPANSION_MAP, DEVICE_EXPANSION_MAP) always come from
 * topologyData.js because they represent application-level drill-down logic,
 * not raw network topology data.
 *
 * To override with a custom topology: place a topology.json in the /public
 * folder conforming to the schema described in ntpl_transformBackboneJson.
 */

import {
  PHASE1_ELEMENTS,
  EXPANSION_MAP,
  DEVICE_EXPANSION_MAP,
  NETWORK_STATS,
  ALL_EXPANSION_MAP,
  EXPANDABLE_IDS,
} from './topologyData';

// ─── JSON schema transformer ──────────────────────────────────────────────────

/**
 * Transforms a topology JSON backbone object into Cytoscape element format.
 *
 * Expected JSON schema:
 *   {
 *     "nodes": [
 *       { "id", "label", "displayLabel", "type", "isGroup", "level", "meta": {...} }
 *     ],
 *     "edges": [
 *       { "id", "source", "target", "edgeType", "bandwidth", "protocol" }
 *     ]
 *   }
 *
 * Args:
 *   json (Object): Parsed topology.json content.
 *
 * Returns:
 *   Array|null: Cytoscape-compatible element objects, or null if format is invalid.
 *
 * Raises:
 *   None — logs warning and returns null on bad input.
 */
function ntpl_transformBackboneJson(json) {
  try {
    if (!json || !Array.isArray(json.nodes) || !Array.isArray(json.edges)) {
      console.warn('[ntpl_transformBackboneJson] Invalid format: missing nodes/edges arrays');
      return null;
    }

    if (json.nodes.length === 0) {
      console.warn('[ntpl_transformBackboneJson] JSON contains no nodes');
      return null;
    }

    const nodes = json.nodes.map((n) => {
      if (!n.id || !n.type) {
        console.warn('[ntpl_transformBackboneJson] Node missing required fields:', n);
      }
      const meta = n.meta != null && typeof n.meta === 'object' ? n.meta : {};
      return {
        data: {
          id:           String(n.id ?? ''),
          label:        String(n.label ?? n.id ?? ''),
          displayLabel: String(n.displayLabel ?? n.label ?? n.id ?? ''),
          type:         String(n.type ?? 'unknown'),
          isGroup:      Boolean(n.isGroup ?? false),
          level:        Number(n.level ?? 0),
          // Flatten for Cytoscape data-attribute selectors (nested obj not queryable)
          status:       String(meta.status ?? n.status ?? 'unknown'),
          meta,
        },
      };
    });

    const edges = json.edges.map((e) => {
      if (!e.id || !e.source || !e.target) {
        console.warn('[ntpl_transformBackboneJson] Edge missing required fields:', e);
      }
      return {
        data: {
          id:        String(e.id ?? ''),
          source:    String(e.source ?? ''),
          target:    String(e.target ?? ''),
          edgeType:  String(e.edgeType  ?? 'backbone'),
          bandwidth: String(e.bandwidth ?? ''),
          protocol:  String(e.protocol  ?? ''),
        },
      };
    });

    return [...nodes, ...edges];
  } catch (error) {
    console.error('[ntpl_transformBackboneJson] Transform failed:', error);
    return null;
  }
}

// ─── Status flattener (fallback path) ────────────────────────────────────────

/**
 * Ensures every node element in the array has a top-level `status` field
 * derived from `data.meta.status`. Required because Cytoscape data-attribute
 * selectors (`node[status="critical"]`) cannot traverse nested objects.
 * Edge elements pass through unchanged.
 *
 * Args:
 *   elements (Array): Cytoscape element array (nodes + edges).
 *
 * Returns:
 *   Array: Same array with `status` flattened onto node data objects.
 *
 * Raises:
 *   None — returns original element on any mapping error.
 */
function ntpl_flattenStatus(elements) {
  try {
    return elements.map((el) => {
      try {
        if (!el.data || el.data.source != null) return el; // edge — skip
        if (el.data.status != null) return el;             // already flat
        const statusFromMeta = el.data.meta?.status;
        if (!statusFromMeta) return el;
        return { ...el, data: { ...el.data, status: String(statusFromMeta) } };
      } catch (_) {
        return el;
      }
    });
  } catch (error) {
    console.error('[ntpl_flattenStatus] Error:', error);
    return elements;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Loads backbone topology elements from /topology.json or falls back to
 * the built-in PHASE1_ELEMENTS from topologyData.js.
 *
 * Args:
 *   None
 *
 * Returns:
 *   Promise<Array>: Resolved Cytoscape element array for the initial view.
 *
 * Raises:
 *   None — always resolves (never rejects); errors are logged as warnings.
 */
export async function ntpl_loadBackboneElements() {
  try {
    const response = await fetch('/topology.json', { cache: 'no-store' });

    if (!response.ok) {
      console.warn(
        `[ntpl_loadBackboneElements] /topology.json responded ${response.status} — using built-in data`,
      );
      return PHASE1_ELEMENTS;
    }

    const json = await response.json();
    const elements = ntpl_transformBackboneJson(json);

    if (elements && elements.length > 0) {
      const nodeCount = elements.filter((e) => !e.data.source).length;
      const edgeCount = elements.filter((e) =>  e.data.source).length;
      console.info(
        `[ntpl_loadBackboneElements] Loaded from /topology.json ` +
        `(${nodeCount} nodes, ${edgeCount} edges)`,
      );
      // status is already flattened by ntpl_transformBackboneJson
      return elements;
    }
  } catch (error) {
    console.warn('[ntpl_loadBackboneElements] /topology.json unavailable:', error.message);
  }

  console.info('[ntpl_loadBackboneElements] Using built-in topology data');
  return ntpl_flattenStatus(PHASE1_ELEMENTS);
}

// Re-export expansion maps so consumers use topologyLoader as single import point
export {
  EXPANSION_MAP,
  DEVICE_EXPANSION_MAP,
  NETWORK_STATS,
  ALL_EXPANSION_MAP,
  EXPANDABLE_IDS,
};
