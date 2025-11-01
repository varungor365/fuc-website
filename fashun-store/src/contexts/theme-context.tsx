'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type SeasonalTheme = 'default' | 'halloween' | 'christmas' | 'summer' | 'spring';

interface ThemeContextType {
  theme: Theme;
  seasonalTheme: SeasonalTheme;
  toggleTheme: () => void;
  setSeasonalTheme: (theme: SeasonalTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [seasonalTheme, setSeasonalThemeState] = useState<SeasonalTheme>('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved theme
    const savedTheme = localStorage.getItem('fashun-theme') as Theme;
    const savedSeasonalTheme = localStorage.getItem('fashun-seasonal-theme') as SeasonalTheme;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }

    if (savedSeasonalTheme) {
      setSeasonalThemeState(savedSeasonalTheme);
    } else {
      // Auto-detect season
      const month = new Date().getMonth();
      if (month === 9 || month === 10) { // October-November
        setSeasonalThemeState('halloween');
      } else if (month === 11 || month === 0) { // December-January
        setSeasonalThemeState('christmas');
      } else if (month >= 5 && month <= 7) { // June-August
        setSeasonalThemeState('summer');
      } else if (month >= 2 && month <= 4) { // March-May
        setSeasonalThemeState('spring');
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('fashun-theme', theme);

    // Apply seasonal theme
    document.documentElement.setAttribute('data-seasonal-theme', seasonalTheme);
  }, [theme, seasonalTheme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setSeasonalTheme = (newTheme: SeasonalTheme) => {
    setSeasonalThemeState(newTheme);
    localStorage.setItem('fashun-seasonal-theme', newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, seasonalTheme, toggleTheme, setSeasonalTheme }}>
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
