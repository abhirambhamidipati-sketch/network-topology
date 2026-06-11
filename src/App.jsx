import React from 'react';
import { CytoscapeProvider } from './context/CytoscapeContext';
import TopBar        from './components/TopBar';
import NetworkGraph  from './graph/NetworkGraph';
import RightPanel    from './panels/RightPanel';
import './styles/app.css';

/**
 * Application shell.
 *
 * Layout:
 *   ┌─────────────────────────────────────┐
 *   │              TopBar (54px)          │
 *   ├───────────────────────┬─────────────┤
 *   │  Graph Canvas         │ Right Panel │
 *   │  • NetworkGraph       │  320px      │
 *   └───────────────────────┴─────────────┘
 *
 * CytoscapeProvider wraps the body so both NetworkGraph (producer) and
 * RightPanel controls (consumers) share the same cy ref.
 */
export default function App() {
  return (
    <div className="app">
      <TopBar />
      <CytoscapeProvider>
        <div className="app-body">
          <main className="graph-canvas" aria-label="Network topology graph">
            <NetworkGraph />
          </main>
          <RightPanel />
        </div>
      </CytoscapeProvider>
    </div>
  );
}
