import React, { useEffect } from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus } from "react-icons/fa";
import UserMenu from './UserMenu';

import logo from '../assets/foodlover.svg';

const SORT_OPTIONS = [
  { value: 'alltime', label: 'All Time' },
  { value: 'monthly', label: 'This Month' },
  { value: 'daily', label: 'Today' },
];
const SORT_BY_OPTIONS = [
  { value: 'date', label: 'Newest' },
  { value: 'views', label: 'Most Viewed' },
];

const Header = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate ? useNavigate() : null;
    const [searchText, setSearchText] = React.useState("");

    // Synchronize searchText with the URL's search query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search') || "";
        setSearchText(searchParam);
    }, [location.search]);

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (searchText.trim()) {
                // Go to homepage with search param
                if (navigate) navigate(`/?search=${encodeURIComponent(searchText.trim())}`);
            } else {
                // Remove search param to show all posts
                if (navigate) navigate(`/`);
            }
        }
    };

    return (
      <header className='forum-header'>
        <div className='forum-seperate-part'>
          <div className='forum-logo'>
            <Link to="/">
              <img src={logo} alt="FoodLovers Logo" className="logo-icon" />
              <h2>FoodLovers</h2>
            </Link>
          </div>

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
        </div>
        <div className='forum-seperate-part'>
          <ThemeToggle />
          <Navbar currentPath={location.pathname} />
        </div>
        <div className="forum-user">
          {user ? (
            <div>
              <Link to="/newpost" className="auth-link"><FaPlus /> Create</Link>
              <UserMenu />
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link">Sign In</Link>
              <Link to="/signup" className="auth-link">Sign Up</Link>
            </div>
          )}
        </div>
      </header>
    );
}

export default Header;