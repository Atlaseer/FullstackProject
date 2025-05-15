import React from 'react';
import ThemeToggle from './ThemeToggle';
import Navbar from './Navbar';
import SearchBar from './SearchBar';

const MobileMenu = ({ isOpen, location, navigate }) => {
  const [searchText, setSearchText] = React.useState("");

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (searchText.trim()) {
        navigate(`/?search=${encodeURIComponent(searchText.trim())}`);
      } else {
        navigate(`/`);
      }
    }
  };

  return (
    <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearchKeyDown={handleSearchKeyDown}
      />
      <Navbar currentPath={location.pathname} />
    </nav>
  );
};

export default MobileMenu;
