import React, { useCallback } from "react";
import "../styles/searchresults.css";

const SearchResults = ({ results, onSelect, searchQuery }) => {
  const handleSelect = useCallback(
    (pageNumber, index, query) => {
      onSelect(pageNumber, index, query);
    },
    [onSelect, results]
  );

  if (!searchQuery || searchQuery.trim() === "") {
    return (
      <div className="search-placeholder">
        Search inside the document...
      </div>
    );
  }

  if (!results || results.length === 0) {
    return <div className="no-results">No matches found</div>;
  }

  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-results">
      {results.map((res, idx) => (
        <div
          key={idx}
          className="search-result-item"
          onClick={() => handleSelect(res.pageNumber, idx, searchQuery)}
          data-testid={`search-result-${idx}`}
        >
          <div className="result-page">Page {res.pageNumber || "N/A"}</div>
          {res.heading && <div className="result-heading">{res.heading}</div>}
          {res.subheading && (
            <div className="result-subheading">{res.subheading}</div>
          )}
          <div className="result-text">
            {highlightText(res.text, searchQuery)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;