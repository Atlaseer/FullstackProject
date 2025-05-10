import React, {useEffect, useState} from 'react';
import { getStoredTheme, setStoredTheme } from '../utils/theme';

const ThemeToggle = () =>
{
    const [isDark, setIsDark] = useState(getStoredTheme() === 'dark');

    useEffect(() =>
    {
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggle = () =>
    {
        setIsDark((prev) => !prev);
    };

    return (
        <label className="theme-switch">
            <input type="checkbox" checked={isDark} onChange={toggle} />
            <span className="slider"></span>
        </label>
    )
}


export default ThemeToggle;