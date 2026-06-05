import React from 'react';
import useTopologyStore        from '../store/topologyStore';
import { usePathHighlighter }  from '../hooks/usePathHighlighter';

/**
 * Path tracing panel.
 *
 * Workflow:
 *   1. User selects a node in the graph → clicks "Set Source" in NodeDetails.
 *   2. User selects another node → clicks "Set Target" in NodeDetails.
 *   3. User clicks "Find Path" here → path is computed and highlighted.
 *   4. "Clear" removes the path highlight.
 *
 * Args:
 *   None (reads from useTopologyStore)
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
export default function PathPanel() {
  const pathSourceId   = useTopologyStore((s) => s.pathSourceId);
  const pathTargetId   = useTopologyStore((s) => s.pathTargetId);
  const pathElementIds = useTopologyStore((s) => s.pathElementIds);
  const isPathActive   = useTopologyStore((s) => s.isPathActive);

  const { ntpl_computeAndHighlightPath, ntpl_clearPathHighlight, ntpl_setPathSource, ntpl_setPathTarget } =
    usePathHighlighter();

  const canFindPath = Boolean(pathSourceId && pathTargetId);
  const hopCount    = isPathActive
    ? pathElementIds.filter((id) => !id.startsWith('e-')).length
    : 0;

  /**
   * Triggers shortest-path computation and highlighting.
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
  const ntpl_handleFindPath = () => {
    try {
      ntpl_computeAndHighlightPath(pathSourceId, pathTargetId);
    } catch (error) {
      console.error('[ntpl_handleFindPath] Error:', error);
    }
  };

  /**
   * Clears the active path and resets source/target.
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
  const ntpl_handleClear = () => {
    try {
      ntpl_clearPathHighlight();
    } catch (error) {
      console.error('[ntpl_handleClear] Error:', error);
    }
  };

  /**
   * Clears only the source node from path state.
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
  const ntpl_handleClearSource = () => {
    try {
      useTopologyStore.getState().setPathSource(null);
      ntpl_clearPathHighlight();
    } catch (error) {
      console.error('[ntpl_handleClearSource] Error:', error);
    }
  };

  /**
   * Clears only the target node from path state.
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
  const ntpl_handleClearTarget = () => {
    try {
      useTopologyStore.getState().setPathTarget(null);
      ntpl_clearPathHighlight();
    } catch (error) {
      console.error('[ntpl_handleClearTarget] Error:', error);
    }
  };

  return (
    <div className="panel-section">
      <h3 className="panel-section__title">Path Tracing</h3>

      <div className="path-panel">
        {/* Source */}
        <PathSelector
          role="Source"
          nodeId={pathSourceId}
          onClear={ntpl_handleClearSource}
          colorClass="path-selector--source"
        />

        <div className="path-arrow" aria-hidden="true">
          <ArrowIcon />
        </div>

        {/* Target */}
        <PathSelector
          role="Target"
          nodeId={pathTargetId}
          onClear={ntpl_handleClearTarget}
          colorClass="path-selector--target"
        />

        {/* Actions */}
        <div className="path-panel__actions">
          <button
            type="button"
            className="path-find-btn"
            onClick={ntpl_handleFindPath}
            disabled={!canFindPath}
            title={canFindPath ? 'Find shortest path' : 'Select both source and target first'}
          >
            Find Path
          </button>

          {(isPathActive || pathSourceId || pathTargetId) && (
            <button
              type="button"
              className="path-clear-btn"
              onClick={ntpl_handleClear}
              title="Clear path"
            >
              Clear
            </button>
          )}
        </div>

        {/* Result */}
        {isPathActive && (
          <div className="path-result">
            <span className="path-result__label">Shortest path found:</span>
            <span className="path-result__hops">
              {hopCount} node{hopCount !== 1 ? 's' : ''},&nbsp;
              {pathElementIds.length - hopCount} edge{pathElementIds.length - hopCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {canFindPath && !isPathActive && (
          <p className="path-panel__hint">
            Select both nodes and click Find Path to trace the shortest route.
          </p>
        )}

        {!canFindPath && !isPathActive && (
          <p className="path-panel__hint">
            Select a node in the graph, then click "Set Source" or "Set Target"
            in the Details section above.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Path node selector ────────────────────────────────────────────────────

/**
 * Renders a source or target node selector slot.
 *
 * Args:
 *   role       (string):   'Source' or 'Target'.
 *   nodeId     (string):   Currently assigned node ID (or null).
 *   onClear    (Function): Called when the clear button is clicked.
 *   colorClass (string):   CSS modifier class for accent colour.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function PathSelector({ role, nodeId, onClear, colorClass }) {
  return (
    <div className={`path-selector ${colorClass}`}>
      <span className="path-selector__role">{role}</span>
      {nodeId ? (
        <div className="path-node-badge">
          <span className="path-node-badge__id">{nodeId}</span>
          <button
            type="button"
            className="path-node-badge__clear"
            onClick={onClear}
            aria-label={`Clear ${role}`}
          >
            ×
          </button>
        </div>
      ) : (
        <span className="path-selector__empty">Not set</span>
      )}
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <polyline points="4,10 8,14 12,10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
