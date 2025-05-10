import { FaSearch, FaUserCircle } from 'react-icons/fa';
import React from 'react';

import Navbar from './Navbar';

import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';


const Header = () => {
    const { user } = useAuth();

    return(
        <header className='forum-header'>
            <div className='forum-logo'><Link to="/"><h2>FoodLovers</h2></Link></div>

            <div className="forum-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="search-input"
                />
            </div>
            <ThemeToggle/>
            <Navbar/>
            <div className="forum-user">
            <FaUserCircle className="user-icon" />
                <span className="user-name">{user ? user.username : 'Not Signed in'}</span>
            </div>
        </header>
    )
}

export default Header;