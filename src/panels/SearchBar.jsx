import React, { useState, useCallback } from 'react';

export default function SearchBar() {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    // Phase 2: dispatch search action to store
  }, []);

  const handleClear = useCallback(() => {
    setValue('');
  }, []);

  return (
    <div className="search-bar">
      <div className="search-bar__icon" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="9.9" y1="9.9" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <input
        className="search-bar__input"
        type="text"
        placeholder="Search nodes…"
        value={value}
        onChange={handleChange}
        aria-label="Search topology nodes"
        spellCheck={false}
        autoComplete="off"
      />
      {value && (
        <button
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            <line x1="12" y1="2" x2="2"  y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
