import React from 'react';
import { useCytoscape }       from '../hooks/useCytoscape';
import { useExpansionManager } from '../graph/useExpansionManager';

/**
 * Graph control button panel.
 *
 * Sections:
 *   Viewport — Fit Graph, Zoom In, Zoom Out, Reset View
 *   Groups   — Expand All (stub), Collapse All
 *
 * Args:
 *   None
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
export default function GraphControls() {
  const {
    ntpl_fitGraph,
    ntpl_resetView,
    ntpl_zoomIn,
    ntpl_zoomOut,
  }                           = useCytoscape();
  const { ntpl_collapseAllGroups } = useExpansionManager();

  return (
    <div className="panel-section">
      <h3 className="panel-section__title">Graph Controls</h3>

      <div className="controls-grid controls-grid--4">
        <ControlButton
          onClick={ntpl_zoomIn}
          icon={<ZoomInIcon />}
          label="Zoom In"
          title="Zoom in"
        />
        <ControlButton
          onClick={ntpl_zoomOut}
          icon={<ZoomOutIcon />}
          label="Zoom Out"
          title="Zoom out"
        />
        <ControlButton
          onClick={ntpl_fitGraph}
          icon={<FitIcon />}
          label="Fit View"
          title="Fit all nodes in view"
        />
        <ControlButton
          onClick={ntpl_resetView}
          icon={<ResetIcon />}
          label="Reset"
          title="Reset pan and zoom"
        />
      </div>

      <div className="controls-grid controls-grid--2" style={{ marginTop: 'var(--sp-2)' }}>
        <ControlButton
          onClick={ntpl_collapseAllGroups}
          icon={<CollapseIcon />}
          label="Collapse All"
          title="Collapse all expanded groups"
        />
        <ControlButton
          onClick={() => {}}
          icon={<ExpandIcon />}
          label="Expand All"
          title="Expand all top-level groups (available after first expansion)"
          disabled
        />
      </div>

      <p className="controls-hint">
        Double-click a group to expand · Single-click to select
      </p>
    </div>
  );
}

// ─── Reusable button ───────────────────────────────────────────────────────

/**
 * Renders a labelled icon button for graph controls.
 *
 * Args:
 *   onClick  (Function): Click handler.
 *   icon     (JSX):      Icon element.
 *   label    (string):   Text label below icon.
 *   title    (string):   Tooltip text.
 *   disabled (boolean):  Disabled state (default false).
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function ControlButton({ onClick, icon, label, title, disabled = false }) {
  /**
   * Wraps the provided onClick in error handling.
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
  const ntpl_handleClick = () => {
    try {
      if (disabled) return;
      onClick();
    } catch (error) {
      console.error('[ControlButton] Click handler failed:', error);
    }
  };

  return (
    <button
      type="button"
      className={`ctrl-btn${disabled ? ' ctrl-btn--disabled' : ''}`}
      onClick={ntpl_handleClick}
      title={title}
      disabled={disabled}
      aria-disabled={disabled}
    >
      <span className="ctrl-btn__icon" aria-hidden="true">{icon}</span>
      <span className="ctrl-btn__label">{label}</span>
    </button>
  );
}

// ─── SVG icon components ───────────────────────────────────────────────────

function ZoomInIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="9.9" y1="9.9" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="6.5" y1="4.5" x2="6.5" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function ZoomOutIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
      <line x1="9.9" y1="9.9" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="4.5" y1="6.5" x2="8.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
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
function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
