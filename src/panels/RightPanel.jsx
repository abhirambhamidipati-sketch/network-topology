import React from 'react';
import SearchBar     from './SearchBar';
import FilterSection from './FilterSection';
import GraphControls from './GraphControls';
import NodeDetails   from './NodeDetails';
import StatsPanel    from './StatsPanel';
import useTopologyStore from '../store/topologyStore';

/**
 * Permanent right-hand panel.
 *
 * Sections (top to bottom):
 *   1. SearchBar        — live node search with autocomplete
 *   2. FilterSection    — 10 node type visibility toggles with device counts
 *   3. GraphControls    — zoom, fit, collapse all
 *   4. NodeDetails      — selected node/edge details and insights
 *   5. StatsPanel       — QWERTY Corp network overview statistics
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
export default function RightPanel() {
  const isExpanding = useTopologyStore((s) => s.isExpanding);

  return (
    <aside className="right-panel" aria-label="Topology controls and details">
      {isExpanding && (
        <div className="right-panel__loading" aria-live="polite" aria-label="Expanding group" />
      )}

      <div className="right-panel__scroll">

        <section className="right-panel__section">
          <SearchBar />
        </section>

        <div className="right-panel__divider" role="separator" />

        <section className="right-panel__section">
          <FilterSection />
        </section>

        <div className="right-panel__divider" role="separator" />

        <section className="right-panel__section">
          <GraphControls />
        </section>

        <div className="right-panel__divider" role="separator" />

        <section className="right-panel__section right-panel__section--grow">
          <NodeDetails />
        </section>

        <div className="right-panel__divider" role="separator" />

        <StatsPanel />

      </div>
    </aside>
  );
}
