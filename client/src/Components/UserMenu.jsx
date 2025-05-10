import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserMenu = () =>
{
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    const handleLogout = async () => 
    {
        await logout();
        setOpen(false);
        navigate('/');
    };

    useEffect(() => 
    {
        const handleOutsideClick = (e) => 
        {
            if(menuRef.current && !menuRef.current.contains(e.target))
            {
                setOpen(false);
            }
            if (e.type === 'keydown' && e.key === 'Escape') 
            {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return() => document.removeEventListener('mousedown', handleOutsideClick);
    })

    return (
    <div className="user-dropdown-wrapper" ref={menuRef}>
      <button
        className="user-dropdown-button"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaUserCircle className="user-icon" />
        <span className="user-name">{user?.username}</span>
        <FaChevronDown className="dropdown-chevron" />
      </button>

      {open && (
        <div className="user-dropdown-menu">
          <Link to={`/profile/${user?.username}`} onClick={() => setOpen(false)}>
            Profile
          </Link>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;