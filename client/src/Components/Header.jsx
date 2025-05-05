import { FaSearch, FaUserCircle } from 'react-icons/fa';
import React from 'react';
import '../styles/Header.css';
import Navbar from './Navbar';

const Header = () => {
    return(
        <header className='forum-header'>
            <div className='forum-logo'>FoodLovers</div>

            <div className="forum-search">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="search-input"
                />
            </div>

            <Navbar/>
            <div className="forum-user">
                <FaUserCircle className="user-icon" />
                <span className="user-name">Username</span>
            </div>
        </header>
    )
}

export default Header;