import React, { useState, useCallback, useRef, useEffect } from 'react';
import useTopologyStore       from '../store/topologyStore';
import { useSearch }          from '../hooks/useSearch';
import { ntpl_annotateMatch } from '../utils/searchUtils';

/**
 * Live search bar with dropdown autocomplete.
 *
 * Behaviour:
 *   — Every keystroke queries the in-memory search index.
 *   — Results appear in an overlay dropdown (max 8 items).
 *   — Keyboard navigation: ArrowUp/Down to move, Enter to select, Escape to close.
 *   — Selecting a result expands parent groups and centers the target node.
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
export default function SearchBar() {
  const [inputValue,    setInputValue]    = useState('');
  const [focusedIndex,  setFocusedIndex]  = useState(-1);
  const [isOpen,        setIsOpen]        = useState(false);

  const inputRef    = useRef(null);
  const dropdownRef = useRef(null);

  const searchResults  = useTopologyStore((s) => s.searchResults);
  const { ntpl_handleSearchInput, ntpl_focusSearchResult, ntpl_clearSearch } = useSearch();

  /**
   * Handles input changes: runs the search query and opens the dropdown.
   *
   * Args:
   *   e (Event): Input change event.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_handleChange = useCallback((e) => {
    try {
      const value = e.target.value;
      setInputValue(value);
      setFocusedIndex(-1);
      setIsOpen(value.trim().length > 0);
      ntpl_handleSearchInput(value);
    } catch (error) {
      console.error('[ntpl_handleChange] Error:', error);
    }
  }, [ntpl_handleSearchInput]);

  /**
   * Clears the search field and closes the dropdown.
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
  const ntpl_handleClear = useCallback(() => {
    try {
      setInputValue('');
      setFocusedIndex(-1);
      setIsOpen(false);
      ntpl_clearSearch();
      inputRef.current?.focus();
    } catch (error) {
      console.error('[ntpl_handleClear] Error:', error);
    }
  }, [ntpl_clearSearch]);

  /**
   * Handles keyboard navigation within the search results dropdown.
   *
   * Args:
   *   e (KeyboardEvent): Key down event.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_handleKeyDown = useCallback((e) => {
    try {
      if (!isOpen || searchResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, searchResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        ntpl_selectResult(searchResults[focusedIndex]);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    } catch (error) {
      console.error('[ntpl_handleKeyDown] Error:', error);
    }
  }, [isOpen, searchResults, focusedIndex]);

  /**
   * Selects a search result, triggers graph centering, and closes the dropdown.
   *
   * Args:
   *   result (Object): A search index entry.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_selectResult = useCallback((result) => {
    try {
      setInputValue('');
      setIsOpen(false);
      setFocusedIndex(-1);
      ntpl_focusSearchResult(result);
    } catch (error) {
      console.error('[ntpl_selectResult] Error:', error);
    }
  }, [ntpl_focusSearchResult]);

  // Close dropdown when clicking outside
  useEffect(() => {
    /**
     * Closes the dropdown if a click occurs outside the search bar component.
     *
     * Args:
     *   e (MouseEvent): Global click event.
     *
     * Returns:
     *   void
     *
     * Raises:
     *   None
     */
    const ntpl_handleOutsideClick = (e) => {
      try {
        if (
          inputRef.current &&
          !inputRef.current.closest('.search-bar-wrapper')?.contains(e.target)
        ) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error('[ntpl_handleOutsideClick] Error:', error);
      }
    };

    document.addEventListener('mousedown', ntpl_handleOutsideClick);
    return () => document.removeEventListener('mousedown', ntpl_handleOutsideClick);
  }, []);

  const showDropdown = isOpen && searchResults.length > 0;

  return (
    <div className="search-bar-wrapper">
      <div className="search-bar">
        <div className="search-bar__icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="9.9" y1="9.9" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <input
          ref={inputRef}
          className="search-bar__input"
          type="text"
          placeholder="Search nodes, IPs, regions…"
          value={inputValue}
          onChange={ntpl_handleChange}
          onKeyDown={ntpl_handleKeyDown}
          onFocus={() => inputValue.trim() && setIsOpen(true)}
          aria-label="Search topology nodes"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          role="combobox"
          spellCheck={false}
          autoComplete="off"
        />

        {inputValue && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={ntpl_handleClear}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="search-dropdown"
          role="listbox"
          aria-label="Search results"
        >
          {searchResults.map((result, idx) => (
            <SearchResultItem
              key={result.id}
              result={result}
              query={inputValue}
              isFocused={idx === focusedIndex}
              onSelect={ntpl_selectResult}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search result item ────────────────────────────────────────────────────

/**
 * Renders a single row in the search results dropdown.
 *
 * Args:
 *   result    (Object):   Search index entry.
 *   query     (string):   Current query (for match highlighting).
 *   isFocused (boolean):  Whether this item is keyboard-focused.
 *   onSelect  (Function): Callback when item is selected.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function SearchResultItem({ result, query, isFocused, onSelect }) {
  const segments = ntpl_annotateMatch(result.label, query);

  /**
   * Handles mouse down on a result (mousedown fires before input blur).
   *
   * Args:
   *   e (MouseEvent): Mouse down event.
   *
   * Returns:
   *   void
   *
   * Raises:
   *   None
   */
  const ntpl_handleMouseDown = (e) => {
    try {
      e.preventDefault();
      onSelect(result);
    } catch (error) {
      console.error('[ntpl_handleMouseDown] Error:', error);
    }
  };

  return (
    <div
      className={`search-result-item${isFocused ? ' search-result-item--focused' : ''}`}
      role="option"
      aria-selected={isFocused}
      onMouseDown={ntpl_handleMouseDown}
    >
      <div className="search-result__body">
        <span className="search-result__name">
          {segments.map((seg, i) =>
            seg.match
              ? <mark key={i} className="search-result__match">{seg.text}</mark>
              : <span key={i}>{seg.text}</span>,
          )}
        </span>

        <span className="search-result__meta">
          {result.breadcrumb !== result.label
            ? result.breadcrumb
            : result.typeLabel}
        </span>
      </div>

      <div className="search-result__right">
        {result.ip && (
          <span className="search-result__ip">{result.ip}</span>
        )}
        <LevelBadge level={result.level} />
      </div>
    </div>
  );
}

/**
 * Renders a level indicator badge for search results.
 *
 * Args:
 *   level (number): 0 = group, 1 = sub-group, 2 = device.
 *
 * Returns:
 *   JSX.Element
 *
 * Raises:
 *   None
 */
function LevelBadge({ level }) {
  const labels = { 0: 'Group', 1: 'Sub-Group', 2: 'Device' };
  const label  = labels[level] ?? 'Node';
  return <span className="search-result__level-badge">{label}</span>;
}
