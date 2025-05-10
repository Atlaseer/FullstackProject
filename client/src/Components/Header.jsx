import React from 'react';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';


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
                {user ? (
                    <Link to={`/profile/${user?.username}`}>
                        <FaUserCircle className="user-icon" />
                        <span className="user-name">{user?.username}</span>
                    </Link>
                ) : 
                    <div className="auth-buttons">
                        <Link to="/login" className="auth-link">Sign In</Link>
                        <Link to="/signup" className="auth-link">Register</Link>
                    </div>
                }
            </div>
        </header>
    )
}

export default Header;