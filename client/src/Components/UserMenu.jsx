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
        }
    })
}