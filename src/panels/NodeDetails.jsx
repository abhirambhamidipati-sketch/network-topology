import React from 'react';
import useTopologyStore from '../store/topologyStore';
import { TYPE_LABELS } from '../data/topologyData';

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
        </p>
      )}

      {hasNode && <NodeCard id={selectedNodeId} data={selectedNodeData} />}
      {hasEdge && <EdgeCard data={selectedEdgeData} />}
    </div>
  );
}

// ─── Node detail card ──────────────────────────────────────────────────────

function NodeCard({ id, data }) {
  const { type, label, meta } = data;
  const typeLabel = TYPE_LABELS[type] ?? type;
  const status    = meta?.status ?? 'unknown';

  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <span className="detail-card__label">{label?.replace(/\n/g, ' ')}</span>
        <StatusBadge status={status} />
      </div>

      <dl className="detail-list">
        <DetailRow term="ID"    value={id} mono />
        <DetailRow term="Type"  value={typeLabel} />
        {meta?.description && (
          <DetailRow term="Description" value={meta.description} />
        )}
        {meta?.deviceCount !== undefined && (
          <DetailRow
            term="Devices"
            value={`${meta.deviceCount} ${meta.deviceCount === 1 ? 'device' : 'devices'}`}
          />
        )}
      </dl>

      {data.isGroup && (
        <p className="detail-card__hint">
          Double-click to expand this group.
        </p>
      )}
    </div>
  );
}

// ─── Edge detail card ──────────────────────────────────────────────────────

function EdgeCard({ data }) {
  const { source, target, bandwidth, protocol, edgeType } = data;

  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <span className="detail-card__label">Connection</span>
        <span className="badge badge--neutral">{edgeType ?? 'link'}</span>
      </div>

      <dl className="detail-list">
        <DetailRow term="From"     value={source}    mono />
        <DetailRow term="To"       value={target}    mono />
        {bandwidth && <DetailRow term="Bandwidth" value={bandwidth} />}
        {protocol  && <DetailRow term="Protocol"  value={protocol}  />}
      </dl>
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cls =
    status === 'healthy'  ? 'badge badge--ok'   :
    status === 'warning'  ? 'badge badge--warn' :
    status === 'critical' ? 'badge badge--crit' :
                            'badge badge--neutral';

  const label =
    status === 'healthy'  ? 'Healthy'  :
    status === 'warning'  ? 'Warning'  :
    status === 'critical' ? 'Critical' :
                            status;

  return <span className={cls}>{label}</span>;
}

function DetailRow({ term, value, mono = false }) {
  if (!value && value !== 0) return null;
  return (
    <>
      <dt className="detail-list__term">{term}</dt>
      <dd className={`detail-list__value${mono ? ' detail-list__value--mono' : ''}`}>
        {value}
      </dd>
    </>
  );
}
