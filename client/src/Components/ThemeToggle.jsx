import React, { useEffect, useState } from 'react';
import { getStoredTheme, setStoredTheme } from '../utils/theme';

const ThemeToggle = () =>
{
    const [isDark, setIsDark] = useState(getStoredTheme() === 'dark');

    useEffect(() =>
    {
        setStoredTheme(isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggle = () => setIsDark((prev) => !prev);

    return (
        <div className="theme-toggle-wrapper">
            <label className="theme-switch" aria-label="Toggle dark mode">
                <input type="checkbox" checked={isDark} onChange={toggle} />
                <span className="slider"></span>
                
            </label>
            <span className="theme-label">{isDark ? 'Dark' : 'Light'} Mode</span>
        </div>
    );
}


export default ThemeToggle;