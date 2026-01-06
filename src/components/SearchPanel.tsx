import React, { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';

interface SearchPanelProps {
  document: string;
  onHighlight: (matches: number[], term?: string) => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ document, onHighlight }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<number[]>([]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setMatches([]);
      onHighlight([]);
      return;
    }

    const regex = new RegExp(term, 'gi');
    const newMatches: number[] = [];
    let match;
    while ((match = regex.exec(document)) !== null) {
      newMatches.push(match.index);
    }
    setMatches(newMatches);
    onHighlight(newMatches, term);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <FaSearch className="text-pharma-blue" />
        <h3 className="font-bold text-gray-800">Advanced Search</h3>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search in document..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pharma-blue"
      />
      {searchTerm && (
        <div className="mt-2 text-sm text-gray-600">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
        </div>
      )}
    </div>
  );
};

export default SearchPanel;

