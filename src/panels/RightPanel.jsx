import React from 'react';
import SearchBar     from './SearchBar';
import FilterSection from './FilterSection';
import GraphControls from './GraphControls';
import NodeDetails   from './NodeDetails';
import PathPanel     from './PathPanel';
import useTopologyStore from '../store/topologyStore';

/**
 * Permanent right-hand panel.
 *
 * Sections (top to bottom):
 *   1. SearchBar        — live node search with autocomplete
 *   2. FilterSection    — node type visibility toggles
 *   3. GraphControls    — zoom, fit, expand/collapse
 *   4. NodeDetails      — selected node/edge details + path buttons
 *   5. PathPanel        — path tracing UI
 *
 * The layout is section-based: new sections can be inserted at any position
 * without touching sibling sections.
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
        <div className="right-panel__loading" aria-live="polite" aria-label="Expanding group">
          <span className="loading-dot" />
          <span className="loading-dot" />
          <span className="loading-dot" />
        </div>
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

        <section className="right-panel__section">
          <PathPanel />
        </section>

      </div>
    </aside>
  );
}
