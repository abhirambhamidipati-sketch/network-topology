import React from 'react';
import { useCytoscape } from '../hooks/useCytoscape';
import useTopologyStore from '../store/topologyStore';

export default function GraphControls() {
  const { fitGraph, resetView } = useCytoscape();
  const collapseAll = useTopologyStore((s) => s.collapseAll);

  return (
    <div className="panel-section">
      <h3 className="panel-section__title">Graph Controls</h3>
      <div className="controls-grid">
        <ControlButton
          onClick={collapseAll}
          icon={<CollapseIcon />}
          label="Collapse All"
          title="Collapse all expanded groups"
        />
        <ControlButton
          onClick={fitGraph}
          icon={<FitIcon />}
          label="Fit Graph"
          title="Fit all nodes in view"
        />
        <ControlButton
          onClick={resetView}
          icon={<ResetIcon />}
          label="Reset View"
          title="Reset pan and zoom"
        />
      </div>
      <p className="controls-hint">
        Click a node to explore its connections. Double-click to expand groups.
      </p>
    </div>
  );
}

function ControlButton({ onClick, icon, label, title }) {
  return (
    <button
      type="button"
      className="ctrl-btn"
      onClick={onClick}
      title={title}
    >
      <span className="ctrl-btn__icon" aria-hidden="true">{icon}</span>
      <span className="ctrl-btn__label">{label}</span>
    </button>
  );
}

function CollapseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9"   y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1.5" y="9"   width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="9"   y="9"   width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function FitIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 2H2v3.5M10.5 2H14v3.5M5.5 14H2v-3.5M10.5 14H14v-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.5 8a5.5 5.5 0 1 0 1.1-3.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M2.5 3v2.5H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
