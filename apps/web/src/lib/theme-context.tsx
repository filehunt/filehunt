"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'iris' | 'plum' | 'crimson' | 'sky' | 'lime';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('sky');

  useEffect(() => {
    // Load theme from localStorage on mount
    const stored = localStorage.getItem('filehunt-theme') as Theme;
    if (stored && ['iris', 'plum', 'crimson', 'sky', 'lime'].includes(stored)) {
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;

    // Remove all theme data attributes
    root.removeAttribute('data-theme');

    // Apply new theme - always set data-theme attribute
    root.setAttribute('data-theme', theme);

    // Save to localStorage
    localStorage.setItem('filehunt-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
