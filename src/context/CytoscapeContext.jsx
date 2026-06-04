import React, { createContext, useContext, useRef, useCallback, useMemo } from 'react';

const CytoscapeContext = createContext(null);

/**
 * Holds a ref to the live Cytoscape instance.
 * A ref is used intentionally — the cy object is mutable and must never
 * trigger React re-renders when Cytoscape modifies it internally.
 *
 * getCy / setCy are stable function references (useCallback with no deps)
 * so components that list them as useEffect dependencies don't over-fire.
 */
export function CytoscapeProvider({ children }) {
  const cyRef = useRef(null);

  const getCy = useCallback(() => cyRef.current, []);
  const setCy = useCallback((cy) => { cyRef.current = cy; }, []);

  const value = useMemo(() => ({ getCy, setCy }), [getCy, setCy]);

  return (
    <CytoscapeContext.Provider value={value}>
      {children}
    </CytoscapeContext.Provider>
  );
}

export function useCytoscapeContext() {
  const ctx = useContext(CytoscapeContext);
  if (!ctx) {
    throw new Error('useCytoscapeContext must be used inside <CytoscapeProvider>');
  }
  return ctx;
}
