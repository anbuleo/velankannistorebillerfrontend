import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  { id: 'orange', name: 'Vibrant Orange', primary: '#f97316', dark: '#ea580c', textOnPrimary: '#ffffff' },
  { id: 'emerald', name: 'Emerald Green', primary: '#10b981', dark: '#059669', textOnPrimary: '#ffffff' },
  { id: 'blue', name: 'Royal Blue', primary: '#2563eb', dark: '#1d4ed8', textOnPrimary: '#ffffff' },
  { id: 'purple', name: 'Luxury Purple', primary: '#8b5cf6', dark: '#7c3aed', textOnPrimary: '#ffffff' },
  { id: 'red', name: 'Crimson Red', primary: '#ef4444', dark: '#dc2626', textOnPrimary: '#ffffff' },
  { id: 'amber', name: 'Golden Amber', primary: '#f59e0b', dark: '#d97706', textOnPrimary: '#0f172a' },
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('appTheme') || 'orange';
  });

  const setTheme = (newTheme) => {
    if (THEMES.some(t => t.id === newTheme)) {
      setThemeState(newTheme);
      localStorage.setItem('appTheme', newTheme);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: 'orange', setTheme: () => {}, themes: THEMES };
  }
  return context;
};
