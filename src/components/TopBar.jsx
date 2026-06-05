import React from 'react';
import useTopologyStore from '../store/topologyStore';

/**
 * Fixed application toolbar.
 *
 * Displays:
 *   — Brand identity (logo, title, edition badge)
 *   — Dynamic breadcrumb reflecting current expansion depth
 *   — Status indicator (node/group counts + overall health)
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
export default function TopBar() {
  const expandedGroups = useTopologyStore((s) => s.expandedGroups);
  const isPathActive   = useTopologyStore((s) => s.isPathActive);

  const expandedCount  = expandedGroups.size;

  /**
   * Builds the breadcrumb items for the current expansion state.
   *
   * Args:
   *   None
   *
   * Returns:
   *   Array<{label: string, active: boolean}>
   *
   * Raises:
   *   None
   */
  const ntpl_buildBreadcrumbs = () => {
    try {
      const crumbs = [{ label: 'Overview', active: expandedCount === 0 }];
      if (expandedCount > 0) {
        crumbs.push({
          label:  `${expandedCount} group${expandedCount > 1 ? 's' : ''} expanded`,
          active: true,
        });
      }
      if (isPathActive) {
        crumbs.push({ label: 'Path active', active: true });
      }
      return crumbs;
    } catch (error) {
      console.error('[ntpl_buildBreadcrumbs] Error:', error);
      return [{ label: 'Overview', active: true }];
    }
  };

  const breadcrumbs = ntpl_buildBreadcrumbs();

  return (
    <header className="topbar" role="banner">
      <div className="topbar__brand">
        <span className="topbar__logo" aria-hidden="true">
          <NetworkLogo />
        </span>
        <span className="topbar__title">Network Topology</span>
        <span className="topbar__subtitle">Enterprise Explorer</span>
      </div>

      <nav className="topbar__breadcrumb" aria-label="Topology path">
        <ol className="breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <li className="breadcrumb__sep" aria-hidden="true">›</li>
              )}
              <li
                className={`breadcrumb__item${crumb.active ? ' breadcrumb__item--active' : ''}`}
                aria-current={crumb.active && idx === breadcrumbs.length - 1 ? 'page' : undefined}
              >
                {crumb.label}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="topbar__right">
        <TopBarStats expandedCount={expandedCount} />
      </div>
    </header>
  );
}

// ─── Status stats ──────────────────────────────────────────────────────────

/**
 * Renders the right-side stats indicator on the top bar.
 *
 * Args:
 *   expandedCount (number): Number of currently expanded groups.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function TopBarStats({ expandedCount }) {
  try {
    const label = expandedCount > 0
      ? `6 groups · ${expandedCount} expanded`
      : '6 groups · All healthy';

    return (
      <div className="topbar__status">
        <span className="status-dot status-dot--ok" aria-hidden="true" />
        <span className="topbar__status-label">{label}</span>
      </div>
    );
  } catch (error) {
    console.error('[TopBarStats] Render error:', error);
    return null;
  }
}

// ─── Brand logo ────────────────────────────────────────────────────────────

/**
 * Renders the network graph brand logo SVG.
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
function NetworkLogo() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="11" cy="4"  r="2.5" fill="rgba(66,153,225,0.9)"/>
      <circle cx="4"  cy="15" r="2.5" fill="rgba(66,153,225,0.9)"/>
      <circle cx="18" cy="15" r="2.5" fill="rgba(66,153,225,0.9)"/>
      <line x1="11" y1="6.5"  x2="5.5"  y2="12.8" stroke="rgba(66,153,225,0.7)" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="11" y1="6.5"  x2="16.5" y2="12.8" stroke="rgba(66,153,225,0.7)" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="6.5" y1="15"  x2="15.5" y2="15"   stroke="rgba(66,153,225,0.5)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
