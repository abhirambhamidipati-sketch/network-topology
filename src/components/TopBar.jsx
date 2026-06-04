import React from 'react';

/**
 * Fixed application toolbar.
 * Phase 1: brand identity, topology path breadcrumb stub, status indicator.
 * Phase 2+: add breadcrumb navigation, search scope, alert count badge.
 */
export default function TopBar() {
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
          <li className="breadcrumb__item breadcrumb__item--active" aria-current="page">
            Overview
          </li>
        </ol>
      </nav>

      <div className="topbar__right">
        <div className="topbar__status">
          <span className="status-dot status-dot--ok" aria-hidden="true" />
          <span className="topbar__status-label">6 groups · All healthy</span>
        </div>
      </div>
    </header>
  );
}

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
      <line x1="11" y1="6.5"  x2="5.5"  y2="12.8" stroke="rgba(66,153,225,0.7)"  strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="11" y1="6.5"  x2="16.5" y2="12.8" stroke="rgba(66,153,225,0.7)"  strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="6.5" y1="15"  x2="15.5" y2="15"   stroke="rgba(66,153,225,0.5)"  strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
