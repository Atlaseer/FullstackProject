import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaTimes, FaPlus } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/foodlover.svg';
import { getStoredTheme, setStoredTheme } from '../utils/theme';

const Header = () => {
    const { user, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate ? useNavigate() : null;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isDark, setIsDark] = useState(getStoredTheme() === 'dark');

    useEffect(() =>
    {
        setStoredTheme(isDark ? 'dark' : 'light');
    }, [isDark]);

    // Check screen resolution to determine if mobile view is needed
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Synchronize searchText with the URL's search query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search') || "";
        setSearchText(searchParam);
    }, [location.search]);

    // Reset searchText when navigating to a new page
    useEffect(() => {
        const unlisten = () => setSearchText("");
        window.addEventListener('popstate', unlisten);

        return () => {
            window.removeEventListener('popstate', unlisten);
        };
    }, []);

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
            <Link to="/" className='logo-link'>
              <img src={logo} alt="FoodLovers Logo" className="logo-icon" />
              <h2>FoodLovers</h2>
            </Link>
          </div>

          
        </div>
        <div>

        {isMobileView ? (
            <>
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
                >
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
              <MobileMenu
                isOpen={isMobileMenuOpen}
                location={location}
                navigate={navigate}
                searchText={searchText}
                setSearchText={setSearchText}
                handleSearchKeyDown={handleSearchKeyDown}
                />
            </>
          ) : (
              <>
              <SearchBar
                searchText={searchText}
                setSearchText={setSearchText}
                handleSearchKeyDown={handleSearchKeyDown}
                />
              <Navbar currentPath={location.pathname} />
            </>
          )}
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