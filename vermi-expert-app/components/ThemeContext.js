import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light theme
  const [loading, setLoading] = useState(true); // To control flicker

  // Function to load the theme preference from AsyncStorage
  const loadTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem('isDarkMode');
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme)); // Set to the stored theme
      }
    } catch (error) {
      console.error('Error loading theme from AsyncStorage', error);
    } finally {
      setLoading(false); // Set loading to false once theme is loaded
    }
  };

  // Function to save the theme preference to AsyncStorage
  const saveTheme = async (theme) => {
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme to AsyncStorage', error);
    }
  };

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      saveTheme(newMode); // Save the new theme to AsyncStorage
      return newMode;
    });
  };

  // Load the theme when the component mounts
  useEffect(() => {
    loadTheme();
  }, []);

  // If the theme is loading, return a fallback view or nothing
  if (loading) {
    return null; // Or return a loading spinner or splash screen
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
