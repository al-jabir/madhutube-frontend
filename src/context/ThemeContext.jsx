import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const getStoredTheme = () => {
  try {
    return localStorage.getItem('madhutube-theme') || 'system';
  } catch {
    return 'system';
  }
};

const getSystemTheme = () => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const resolveTheme = (theme) => {
  return theme === 'system' ? getSystemTheme() : theme;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(getStoredTheme);
  const [resolved, setResolved] = useState(() => resolveTheme(getStoredTheme()));

  const applyTheme = useCallback((mode) => {
    const resolvedTheme = resolveTheme(mode);
    setResolved(resolvedTheme);
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Listen for OS preference changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, applyTheme]);

  const setTheme = useCallback((mode) => {
    setThemeState(mode);
    try {
      localStorage.setItem('madhutube-theme', mode);
    } catch { /* ignore */ }
    applyTheme(mode);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
