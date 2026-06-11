import React from 'react';
import useTopologyStore      from '../store/topologyStore';
import { useGraphFiltering } from '../hooks/useGraphFiltering';
import { NETWORK_STATS }     from '../data/topologyData';

const FILTER_ITEMS = [
  { key: 'cloud-group',    label: 'Cloud',     count: 3,                              icon: CloudIcon,    color: '#0369A1' },
  { key: 'vpn-group',      label: 'VPN',       count: NETWORK_STATS.totalVPNGateways, icon: VpnIcon,      color: '#6D28D9' },
  { key: 'firewall-group', label: 'Firewalls', count: NETWORK_STATS.totalFirewalls,   icon: FirewallIcon, color: '#B91C1C' },
  { key: 'router-group',   label: 'Routers',   count: NETWORK_STATS.totalRouters,     icon: RouterIcon,   color: '#0C4A6E' },
  { key: 'switch-group',   label: 'Switches',  count: NETWORK_STATS.totalSwitches,    icon: SwitchIcon,   color: '#134E4A' },
  { key: 'server-group',   label: 'Servers',   count: NETWORK_STATS.totalServers,     icon: ServerIcon,   color: '#1E3A8A' },
  { key: 'laptop-group',   label: 'Laptops',   count: 312,                            icon: LaptopIcon,   color: '#115E59' },
  { key: 'desktop-group',  label: 'Desktops',  count: 148,                            icon: DesktopIcon,  color: '#1D4ED8' },
  { key: 'mobile-group',   label: 'Mobile',    count: 287,                            icon: MobileIcon,   color: '#581C87' },
  { key: 'guest-group',    label: 'Guest',     count: 24,                             icon: GuestIcon,    color: '#92400E' },
];

/**
 * Node type filter pills connected to the live graph.
 *
 * Clicking a pill toggles visibility of that top-level node family
 * in both the Zustand store and the Cytoscape graph simultaneously.
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
  const filters                       = useTopologyStore((s) => s.filters);
  const { ntpl_toggleFilterAndSync }  = useGraphFiltering();

  return (
    <div className="panel-section">
      <h3 className="panel-section__title">Node Types</h3>
      <div className="filter-grid">
        {FILTER_ITEMS.map(({ key, label, count, icon: Icon, color }) => {
          const active = filters[key] ?? true;
          return (
            <FilterPill
              key={key}
              filterKey={key}
              label={label}
              count={count}
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
 *   count     (number):    Device count for this category.
 *   Icon      (Component): Icon component for this type.
 *   color     (string):    Type-specific accent colour.
 *   active    (boolean):   Whether the filter is currently enabled.
 *   onToggle  (Function):  Called with filterKey when clicked.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function FilterPill({ filterKey, label, count, Icon, color, active, onToggle }) {
  /**
   * Handles pill click.
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
      {count !== undefined && (
        <span className="filter-pill__count">{count}</span>
      )}
    </button>
  );
}

// ─── Icon components ───────────────────────────────────────────────────────

function CloudIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 13H6a4.5 4.5 0 1 1 4.3-5.8h1.2a3 3 0 0 1 0 5.8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VpnIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="7.5" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M5.5 7.5V5a2.5 2.5 0 0 1 5 0v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <circle cx="8" cy="11" r="1" fill="currentColor"/>
    </svg>
  );
}

function FirewallIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5l5.5 3v3.5c0 3.5-2.5 6.5-5.5 7.5-3-1-5.5-4-5.5-7.5V4.5L8 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}

function RouterIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="6" width="14" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <line x1="5"  y1="6" x2="5"  y2="4"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="8"  y1="6" x2="8"  y2="2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="11" y1="6" x2="11" y2="4"   stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="5"  cy="9" r="1" fill="currentColor"/>
      <circle cx="8"  cy="9" r="1" fill="currentColor"/>
      <circle cx="11" cy="9" r="1" fill="currentColor"/>
    </svg>
  );
}

function SwitchIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="5.5" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="4"  cy="8" r="0.9" fill="currentColor"/>
      <circle cx="7"  cy="8" r="0.9" fill="currentColor"/>
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

function MobileIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="1.5" width="6" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
      <circle cx="8" cy="12.5" r="0.75" fill="currentColor"/>
    </svg>
  );
}

function GuestIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M3 14v-1.5a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3V14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
