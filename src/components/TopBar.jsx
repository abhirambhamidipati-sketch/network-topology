import React from 'react';
import useTopologyStore from '../store/topologyStore';
import { NETWORK_STATS } from '../data/topologyData';

/**
 * Fixed application toolbar — QWERTY Corporation Network Topology Explorer.
 *
 * Displays:
 *   — Brand identity (logo, product name, company badge)
 *   — Dynamic breadcrumb:
 *       • When a node is selected: shows the full hierarchy path from backbone
 *         to the selected node (e.g. Cloud / Internet › VPN Gateway › VPN-GW-01).
 *         Each crumb is clickable and centres the graph on that node.
 *       • When nothing is selected: shows overview state (groups expanded count).
 *   — Live stat chips (total endpoints, servers, expanded count)
 *   — System health indicator
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
  const expandedGroups   = useTopologyStore((s) => s.expandedGroups);
  const breadcrumb       = useTopologyStore((s) => s.breadcrumb);
  const explorationPath  = useTopologyStore((s) => s.explorationPath);
  const expandedCount    = expandedGroups.size;

  /**
   * Navigates to the node corresponding to a breadcrumb crumb.
   * Triggers the focusedNodeId effect in NetworkGraph.
   *
   * Args:
   *   crumbId (string): The node ID to navigate to.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_navigateToCrumb = (crumbId) => {
    try {
      useTopologyStore.getState().setFocusedNode(crumbId);
    } catch (error) {
      console.error('[ntpl_navigateToCrumb] Error:', error);
    }
  };

  /**
   * Builds breadcrumb items for the TopBar.
   *
   * When a node is selected (store breadcrumb is non-empty), returns the
   * selected node's hierarchy. Otherwise returns the exploration state.
   *
   * Args:
   *   None
   *
   * Returns:
   *   Array<{ label: string, id: string|null, active: boolean }>
   *
   * Raises:
   *   None
   */
  const ntpl_buildBreadcrumbs = () => {
    try {
      // Node selected via single-tap — show the selection hierarchy
      if (breadcrumb.length > 0) {
        return breadcrumb.map((crumb, i) => ({
          label:  crumb.label,
          id:     crumb.id,
          active: i === breadcrumb.length - 1,
        }));
      }

      // User is drilling down via expansion — show the exploration path.
      // "QWERTY Corporation" is a clickable root that collapses all groups.
      if (explorationPath.length > 0) {
        return [
          { label: 'QWERTY Corporation', id: null, active: false },
          ...explorationPath.map((item, i) => ({
            label:  item.label,
            id:     item.id,
            active: i === explorationPath.length - 1,
          })),
        ];
      }

      // Default overview state
      const crumbs = [{ label: 'QWERTY Corporation', id: null, active: expandedCount === 0 }];
      if (expandedCount > 0) {
        crumbs.push({
          label:  `${expandedCount} group${expandedCount !== 1 ? 's' : ''} expanded`,
          id:     null,
          active: true,
        });
      }
      return crumbs;
    } catch (error) {
      console.error('[ntpl_buildBreadcrumbs] Error:', error);
      return [{ label: 'Overview', id: null, active: true }];
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
        <span className="topbar__company">{NETWORK_STATS.companyName}</span>
        <span className="topbar__subtitle">Explorer</span>
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
                {crumb.id ? (
                  <button
                    className="breadcrumb__nav-btn"
                    onClick={() => ntpl_navigateToCrumb(crumb.id)}
                    title={`Navigate to ${crumb.label}`}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  crumb.label
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <div className="topbar__right">
        <TopBarChips expandedCount={expandedCount} />
        <TopBarHealth />
      </div>
    </header>
  );
}

// ─── Right-side chips ──────────────────────────────────────────────────────────

/**
 * Renders stat chips on the right side of the top bar.
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
function TopBarChips({ expandedCount }) {
  try {
    return (
      <>
        <div className="topbar__chip">
          <span className="topbar__chip-value">{NETWORK_STATS.totalEndpoints.toLocaleString()}</span>
          <span>endpoints</span>
        </div>
        <div className="topbar__chip">
          <span className="topbar__chip-value">{NETWORK_STATS.totalServers}</span>
          <span>servers</span>
        </div>
        {expandedCount > 0 && (
          <div className="topbar__chip">
            <span className="topbar__chip-value">{expandedCount}</span>
            <span>expanded</span>
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error('[TopBarChips] Render error:', error);
    return null;
  }
}

/**
 * Renders the system health indicator dot and label.
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
function TopBarHealth() {
  return (
    <div className="topbar__status">
      <span className="status-dot status-dot--ok" aria-hidden="true" />
      <span className="topbar__status-label">All systems healthy</span>
    </div>
  );
}

// ─── Brand logo ────────────────────────────────────────────────────────────────

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
      <circle cx="11" cy="4"  r="2.5" fill="rgba(96,165,250,0.9)"/>
      <circle cx="4"  cy="15" r="2.5" fill="rgba(96,165,250,0.9)"/>
      <circle cx="18" cy="15" r="2.5" fill="rgba(96,165,250,0.9)"/>
      <line x1="11" y1="6.5"  x2="5.5"  y2="12.8" stroke="rgba(96,165,250,0.65)" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="11" y1="6.5"  x2="16.5" y2="12.8" stroke="rgba(96,165,250,0.65)" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="6.5" y1="15"  x2="15.5" y2="15"   stroke="rgba(96,165,250,0.45)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
