import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';

type ThemeName = 'light' | 'dark' | 'premium';
type Theme = typeof Colors.light;

interface ThemeContextType {
  theme: ThemeName;
  colors: Theme;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('premium');

  const setTheme = async (newTheme: ThemeName) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app-theme', newTheme);
  };

  const toggleTheme = () => {
    const themes: ThemeName[] = ['light', 'premium', 'dark'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('app-theme');
      if (savedTheme && ['light', 'dark', 'premium'].includes(savedTheme)) {
        setThemeState(savedTheme as ThemeName);
      }
    };
    loadTheme();
  }, []);

  const colors = Colors[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
