import React from 'react';
import useTopologyStore         from '../store/topologyStore';
import { useGraphFiltering }    from '../hooks/useGraphFiltering';

const FILTER_ITEMS = [
  { key: 'cloud-group',   label: 'Cloud',    icon: CloudIcon,   color: '#4299e1' },
  { key: 'router-group',  label: 'Routers',  icon: RouterIcon,  color: '#9f7aea' },
  { key: 'switch-group',  label: 'Switches', icon: SwitchIcon,  color: '#38b2ac' },
  { key: 'server-group',  label: 'Servers',  icon: ServerIcon,  color: '#e53e3e' },
  { key: 'laptop-group',  label: 'Laptops',  icon: LaptopIcon,  color: '#38a169' },
  { key: 'desktop-group', label: 'Desktops', icon: DesktopIcon, color: '#dd6b20' },
];

/**
 * Node type filter pills connected to the live graph.
 *
 * Clicking a pill toggles the visibility of that node type family in
 * both the Zustand store and the Cytoscape graph simultaneously.
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
export default function FilterSection() {
  const filters                                  = useTopologyStore((s) => s.filters);
  const { ntpl_toggleFilterAndSync }             = useGraphFiltering();

  return (
    <div className="panel-section">
      <h3 className="panel-section__title">Node Types</h3>
      <div className="filter-grid">
        {FILTER_ITEMS.map(({ key, label, icon: Icon, color }) => {
          const active = filters[key] ?? true;
          return (
            <FilterPill
              key={key}
              filterKey={key}
              label={label}
              Icon={Icon}
              color={color}
              active={active}
              onToggle={ntpl_toggleFilterAndSync}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── Filter pill ───────────────────────────────────────────────────────────

/**
 * Renders a single toggle pill for a node type filter.
 *
 * Args:
 *   filterKey (string):    The Zustand filter key.
 *   label     (string):    Display label.
 *   Icon      (Component): Icon component for this type.
 *   color     (string):    Type-specific accent colour.
 *   active    (boolean):   Whether the filter is currently enabled.
 *   onToggle  (Function):  Called with filterKey when the pill is clicked.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function FilterPill({ filterKey, label, Icon, color, active, onToggle }) {
  /**
   * Handles pill click — calls the filter toggle callback.
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
      onToggle(filterKey);
    } catch (error) {
      console.error('[ntpl_handleClick] FilterPill error:', error);
    }
  };

  return (
    <button
      type="button"
      className={`filter-pill ${active ? 'filter-pill--on' : 'filter-pill--off'}`}
      style={active ? { '--pill-accent': color } : undefined}
      onClick={ntpl_handleClick}
      aria-pressed={active}
      title={active ? `Hide ${label}` : `Show ${label}`}
    >
      <span
        className="filter-pill__icon"
        aria-hidden="true"
        style={{ color: active ? color : undefined }}
      >
        <Icon />
      </span>
      <span className="filter-pill__label">{label}</span>
    </button>
  );
}

// ─── Inline icon components ────────────────────────────────────────────────

function CloudIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 13H6a4.5 4.5 0 1 1 4.3-5.8h1.2a3 3 0 0 1 0 5.8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function RouterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6" width="14" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="5" y1="6" x2="5" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="8" y1="6" x2="8" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="11" y1="6" x2="11" y2="4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="5" cy="9" r="1" fill="currentColor"/>
      <circle cx="8" cy="9" r="1" fill="currentColor"/>
      <circle cx="11" cy="9" r="1" fill="currentColor"/>
    </svg>
  );
}
function SwitchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="5.5" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="4" cy="8" r="0.9" fill="currentColor"/>
      <circle cx="7" cy="8" r="0.9" fill="currentColor"/>
      <circle cx="10" cy="8" r="0.9" fill="currentColor"/>
      <circle cx="13" cy="8" r="0.9" fill="currentColor"/>
      <line x1="4"  y1="5.5" x2="4"  y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="7"  y1="5.5" x2="7"  y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="10" y1="5.5" x2="10" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}
function ServerIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="2.5" width="13" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="1.5" y="8"   width="13" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="12.5" cy="4.5" r="0.9" fill="currentColor"/>
      <circle cx="12.5" cy="10"  r="0.9" fill="currentColor"/>
      <line x1="3.5" y1="4.5" x2="8.5" y2="4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="3.5" y1="10"  x2="8.5" y2="10"  stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
    </svg>
  );
}
function LaptopIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M1 13.5h14l-1-3.5H2L1 13.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}
function DesktopIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="2" width="13" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="5.5" y1="14" x2="10.5" y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8"   y1="11" x2="8"    y2="14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
