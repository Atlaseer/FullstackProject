import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus } from "react-icons/fa";
import UserMenu from './UserMenu';

import logo from '../assets/foodlover_mark_only.svg';

const Header = () => {
    const { user } = useAuth();
    const location = useLocation();

    return(
        <header className='forum-header'>
            <div className='forum-seperate-part'>
                <div className='forum-logo'><Link to="/"><img src={logo} alt="FoodLovers Logo" className="logo-icon" /></Link></div>

                <div className="forum-search">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      className="search-input"
                      />
                </div>
            </div>
            <div className='forum-seperate-part'>

            <ThemeToggle/>
            <Navbar currentPath={location.pathname}/>
            </div>
            <div className="forum-user">
                {user ? (
                    <div>
                     <Link to="/newpost" className="auth-link"><FaPlus/> Create</Link>
                    <UserMenu/>
                    </div>
                ) : 
                    <div className="auth-buttons">
                        <Link to="/login" className="auth-link">Sign In</Link>
                        <Link to="/signup" className="auth-link">Sign Up</Link>
                    </div>
                }
            </div>
        </header>
    )
}

export default Header;