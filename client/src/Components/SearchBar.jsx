import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchText, setSearchText, handleSearchKeyDown }) => {
  return (
    <div className="forum-search">
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder="Search topics..."
        className="search-input"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        onKeyDown={handleSearchKeyDown}
      />
    </div>
  );
};

export default SearchBar;
