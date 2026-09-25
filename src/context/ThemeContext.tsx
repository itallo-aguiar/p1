import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to dark mode as requested by the user's prototype screenshot
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('estudovag_theme');
      if (saved) return saved === 'dark';
      return true; // Default to dark mode matching user prototype
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('estudovag_theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark-theme');
      }
    } catch (e) {
      console.error('Falha ao salvar tema:', e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const setTheme = (dark: boolean) => setIsDarkMode(dark);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
