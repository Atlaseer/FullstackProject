import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchText, setSearchText, handleSearchKeyDown }) => {
  return (
    <div className="forum-search" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search topics..."
        className="search-input"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onKeyDown={handleSearchKeyDown}
        style={{ flex: 1, maxWidth: 220, borderRadius: 6, border: '1px solid #ccc', padding: '6px 10px', fontSize: 15 }}
      />
    </div>
  );
};

export default SearchBar;
