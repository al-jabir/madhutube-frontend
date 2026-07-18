import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext.jsx';

const ThemeToggle = () => {
    const { resolved, setTheme } = useTheme();
    const isDark = resolved === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn-icon group"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <SunIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200 text-yellow-500" />
            ) : (
                <MoonIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200 text-gray-600" />
            )}
        </button>
    );
};

export default ThemeToggle;
