import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import SearchResults from "../SearchResults";
import "../../styles/searchpanel.css";
import API from '../../api/api';

const SearchPanel = ({ 
  onClose, 
  onSearch, 
  onResultClick, 
  searchResults = [],
  sessionId //  NEW PROP
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      onSearch([]);
      return;
    }

    //  Check session ID
    if (!sessionId) {
      alert("No session ID found. Please upload files first.");
      return;
    }

    setIsSearching(true);

    try {
      //  Use session-specific endpoint
      // console.log(`Searching in session: ${sessionId}`);
      const response = await API.post(`/api/search/${sessionId}`, { 
        query: query.trim() 
      });
      
      const results = response.data;
      // console.log(` Found ${results.length} results`);
      onSearch(results);
    } catch (error) {
      // console.error("Search error:", error);

      let errorMessage = "Search failed";
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Please fill the document before searching.";
        } else {
          errorMessage = `Search failed: ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please try again.";
      } else {
        errorMessage = error.message;
      }

      alert(errorMessage);
      onSearch([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (timeoutId) clearTimeout(timeoutId);
    if (query.length >= 2) {
      setTimeoutId(setTimeout(() => handleSearch(query), 500));
    } else {
      onSearch([]);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    onSearch([]);
    onClose();
  };

  return (
    <div className="search-panel">
      <div className="panel-header">
        <div className="header-left">
          <FiSearch className="panel-icon" />
          <h3>Search Document</h3>
        </div>
        <button
          className="close-btn"
          onClick={handleClose}
          data-testid="search-panel-close-btn"
        >
          <FiX />
        </button>
      </div>
      <div className="search-container">
        <div className="search-input-wrapper">
          <FiSearch className="search-input-icon" />
          <input
            type="text"
            placeholder="Search in document..."
            value={searchQuery}
            onChange={handleInputChange}
            className="search-input"
            autoFocus
          />
          {isSearching && <div className="search-spinner"></div>}
        </div>
      </div>
      <div className="search-results">
        {searchQuery.length > 0 && !isSearching && (
          <div className="results-header">
            <span>
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} found
            </span>
          </div>
        )}
        <SearchResults
          results={searchResults}
          onSelect={onResultClick}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default SearchPanel;