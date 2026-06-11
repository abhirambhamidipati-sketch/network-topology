import React from 'react';
import useTopologyStore from '../store/topologyStore';
import { NETWORK_STATS } from '../data/topologyData';

/**
 * Network overview statistics panel.
 *
 * Displays summary counts for QWERTY Corporation's network:
 * total endpoints, servers, regions, and active expanded groups.
 *
 * Args:
 *   None (reads from useTopologyStore and NETWORK_STATS)
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
export default function StatsPanel() {
  const expandedGroups = useTopologyStore((s) => s.expandedGroups);

  /**
   * Builds the stat card definitions from static network data and live state.
   *
   * Args:
   *   None
   *
   * Returns:
   *   Array<{value: number|string, label: string, accent?: string}>
   *
   * Raises:
   *   None
   */
  const ntpl_buildStats = () => {
    try {
      return [
        { value: NETWORK_STATS.totalEndpoints.toLocaleString(), label: 'Endpoints',  accent: ''        },
        { value: NETWORK_STATS.totalServers,                    label: 'Servers',    accent: ''        },
        { value: NETWORK_STATS.totalRegions,                    label: 'Regions',    accent: ''        },
        { value: NETWORK_STATS.totalFirewalls,                  label: 'Firewalls',  accent: ''        },
        { value: NETWORK_STATS.totalRouters,                    label: 'Routers',    accent: ''        },
        { value: expandedGroups.size,                           label: 'Expanded',   accent: expandedGroups.size > 0 ? 'accent' : '' },
      ];
    } catch (error) {
      console.error('[ntpl_buildStats] Error:', error);
      return [];
    }
  };

  const stats = ntpl_buildStats();

  return (
    <div className="panel-section">
      <h3 className="panel-section__title">Network Overview</h3>

      <div className="stats-header">
        <span className="stats-header__name">{NETWORK_STATS.companyName}</span>
        <span className="stats-header__emp">{NETWORK_STATS.totalEmployees.toLocaleString()} employees</span>
      </div>

      <div className="stats-grid">
        {stats.map(({ value, label, accent }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-card__value${accent ? ` stat-card__value--${accent}` : ''}`}>
              {value}
            </div>
            <div className="stat-card__label">{label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
