import React from 'react';
import useTopologyStore        from '../store/topologyStore';
import { usePathHighlighter }  from '../hooks/usePathHighlighter';
import { TYPE_LABELS }         from '../data/topologyData';
import { ntpl_formatRelativeTime } from '../utils/graphUtils';

/**
 * Right-panel details section.
 *
 * Renders a NodeCard when a node is selected, an EdgeCard when an edge is
 * selected, or an empty-state prompt otherwise.
 *
 * Args:
 *   None (reads from useTopologyStore)
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
export default function NodeDetails() {
  const selectedNodeId   = useTopologyStore((s) => s.selectedNodeId);
  const selectedNodeData = useTopologyStore((s) => s.selectedNodeData);
  const selectedEdgeData = useTopologyStore((s) => s.selectedEdgeData);

  const hasNode = Boolean(selectedNodeId && selectedNodeData);
  const hasEdge = Boolean(selectedEdgeData && !hasNode);

  return (
    <div className="panel-section panel-section--details">
      <h3 className="panel-section__title">Details</h3>

      {!hasNode && !hasEdge && (
        <p className="details-empty">
          Click a node or edge to inspect it.
          <br />
          Double-click a group to expand it.
        </p>
      )}

      {hasNode && (
        <NodeCard id={selectedNodeId} data={selectedNodeData} />
      )}
      {hasEdge && (
        <EdgeCard data={selectedEdgeData} />
      )}
    </div>
  );
}

// ─── Node detail card ──────────────────────────────────────────────────────

/**
 * Renders a structured detail card for a selected node.
 *
 * Args:
 *   id   (string): Node ID.
 *   data (Object): Full Cytoscape node data object.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function NodeCard({ id, data }) {
  try {
    const { type, label, meta, isGroup, level } = data;
    const typeLabel    = TYPE_LABELS[type] ?? type;
    const status       = meta?.status ?? 'unknown';
    const isExpandable = isGroup || (meta?.deviceCount > 0);

    return (
      <div className="detail-card">
        <div className="detail-card__header">
          <span className="detail-card__label">
            {label?.replace(/\n/g, ' ')}
          </span>
          <StatusBadge status={status} />
        </div>

        <dl className="detail-list">
          <DetailRow term="ID"     value={id}         mono />
          <DetailRow term="Type"   value={typeLabel} />
          {meta?.ip && (
            <DetailRow term="IP / Subnet" value={meta.ip} mono />
          )}
          {meta?.region && (
            <DetailRow term="Region" value={meta.region} />
          )}
          {meta?.role && (
            <DetailRow term="Role" value={meta.role} />
          )}
          {meta?.os && (
            <DetailRow term="OS / Platform" value={meta.os} />
          )}
          {meta?.description && (
            <DetailRow term="Description" value={meta.description} />
          )}
          {meta?.deviceCount !== undefined && meta.deviceCount > 0 && (
            <DetailRow
              term="Devices"
              value={`${meta.deviceCount} device${meta.deviceCount !== 1 ? 's' : ''}`}
            />
          )}
          {meta?.lastUpdated && (
            <DetailRow
              term="Last Seen"
              value={ntpl_formatRelativeTime(meta.lastUpdated)}
            />
          )}
        </dl>

        <NodePathActions nodeId={id} />

        {isExpandable && (
          <p className="detail-card__hint">
            Double-click to expand / collapse this group.
          </p>
        )}
      </div>
    );
  } catch (error) {
    console.error('[NodeCard] Render error:', error);
    return <p className="details-empty">Unable to render node details.</p>;
  }
}

// ─── Edge detail card ──────────────────────────────────────────────────────

/**
 * Renders a structured detail card for a selected edge.
 *
 * Args:
 *   data (Object): Full Cytoscape edge data object.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function EdgeCard({ data }) {
  try {
    const { source, target, bandwidth, protocol, edgeType } = data;

    return (
      <div className="detail-card">
        <div className="detail-card__header">
          <span className="detail-card__label">Connection</span>
          <EdgeTypeBadge type={edgeType} />
        </div>

        <dl className="detail-list">
          <DetailRow term="From"      value={source}    mono />
          <DetailRow term="To"        value={target}    mono />
          {bandwidth && <DetailRow term="Bandwidth" value={bandwidth} />}
          {protocol  && <DetailRow term="Protocol"  value={protocol}  />}
          {edgeType  && <DetailRow term="Link Type" value={ntpl_formatEdgeType(edgeType)} />}
        </dl>
      </div>
    );
  } catch (error) {
    console.error('[EdgeCard] Render error:', error);
    return <p className="details-empty">Unable to render edge details.</p>;
  }
}

// ─── Path action buttons ───────────────────────────────────────────────────

/**
 * Renders "Set as Source" and "Set as Target" path buttons for a node.
 *
 * Args:
 *   nodeId (string): The node ID these buttons act on.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function NodePathActions({ nodeId }) {
  const { ntpl_setPathSource, ntpl_setPathTarget } = usePathHighlighter();
  const pathSourceId = useTopologyStore((s) => s.pathSourceId);
  const pathTargetId = useTopologyStore((s) => s.pathTargetId);

  const isSource = pathSourceId === nodeId;
  const isTarget = pathTargetId === nodeId;

  /**
   * Handles setting current node as path source.
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
  const ntpl_handleSetSource = () => {
    try {
      ntpl_setPathSource(nodeId);
    } catch (error) {
      console.error('[ntpl_handleSetSource] Error:', error);
    }
  };

  /**
   * Handles setting current node as path target.
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
  const ntpl_handleSetTarget = () => {
    try {
      ntpl_setPathTarget(nodeId);
    } catch (error) {
      console.error('[ntpl_handleSetTarget] Error:', error);
    }
  };

  return (
    <div className="detail-card__actions">
      <button
        type="button"
        className={`path-btn path-btn--source${isSource ? ' path-btn--active' : ''}`}
        onClick={ntpl_handleSetSource}
        title="Set as path source"
      >
        {isSource ? '✓ Source' : 'Set Source'}
      </button>
      <button
        type="button"
        className={`path-btn path-btn--target${isTarget ? ' path-btn--active' : ''}`}
        onClick={ntpl_handleSetTarget}
        title="Set as path target"
      >
        {isTarget ? '✓ Target' : 'Set Target'}
      </button>
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────

/**
 * Renders a colour-coded status badge.
 *
 * Args:
 *   status (string): 'healthy' | 'warning' | 'critical' | any
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function StatusBadge({ status }) {
  const cls =
    status === 'healthy'  ? 'badge badge--ok'      :
    status === 'warning'  ? 'badge badge--warn'    :
    status === 'critical' ? 'badge badge--crit'    :
                            'badge badge--neutral';

  const label =
    status === 'healthy'  ? 'Healthy'  :
    status === 'warning'  ? 'Warning'  :
    status === 'critical' ? 'Critical' :
                            status;

  return <span className={cls}>{label}</span>;
}

/**
 * Renders an edge-type badge.
 *
 * Args:
 *   type (string): 'backbone' | 'internal' | 'device' | any
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function EdgeTypeBadge({ type }) {
  return (
    <span className="badge badge--neutral">
      {ntpl_formatEdgeType(type)}
    </span>
  );
}

/**
 * Maps an edge type key to a display-friendly label.
 *
 * Args:
 *   type (string): Edge type key.
 *
 * Returns:
 *   string: Human-readable label.
 *
 * Raises:
 *   None
 */
function ntpl_formatEdgeType(type) {
  try {
    const map = { backbone: 'Backbone', internal: 'Internal', device: 'Device Link' };
    return map[type] ?? type ?? 'Link';
  } catch (error) {
    return type ?? 'Link';
  }
}

/**
 * Renders a single term/value row in the detail list.
 *
 * Args:
 *   term  (string):  Label text.
 *   value (any):     Value to display.
 *   mono  (boolean): Use monospace font for value (default false).
 *
 * Returns:
 *   JSX.Element | null
 *
 * Raises:
 *   None
 */
function DetailRow({ term, value, mono = false }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <>
      <dt className="detail-list__term">{term}</dt>
      <dd className={`detail-list__value${mono ? ' detail-list__value--mono' : ''}`}>
        {value}
      </dd>
    </>
  );
}
