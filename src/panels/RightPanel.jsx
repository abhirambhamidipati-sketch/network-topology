import React from 'react';
import SearchBar     from './SearchBar';
import FilterSection from './FilterSection';
import GraphControls from './GraphControls';
import NodeDetails   from './NodeDetails';

/**
 * Permanent right-hand panel.
 * Architecture is intentionally section-based so Phase 2 can insert new
 * sections (path tracing, alert list, etc.) without touching this layout.
 */
export default function RightPanel() {
  return (
    <aside className="right-panel" aria-label="Topology controls and details">
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
      </div>
    </aside>
  );
}
