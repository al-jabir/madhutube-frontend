import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else {
            setDarkMode(systemPrefersDark);
        }
    }, []);

    useEffect(() => {
        // Apply theme to document
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn-icon group"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <SunIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200 text-yellow-500" />
            ) : (
                <MoonIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200 text-gray-600" />
            )}
        </button>
    );
};

export default ThemeToggle;