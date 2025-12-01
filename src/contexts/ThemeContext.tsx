import React, { createContext, useContext, useState } from "react";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

// Custom themes (modern look)
export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#5A67D8",
    background: "#F7F8FA",
    card: "#ffffff",
    text: "#1A202C",
    border: "#E2E8F0",
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#9F7AEA",
    background: "#0F1115",     // moderni tumma tausta
    card: "#1A1C20",           // kortit tummiksi
    text: "#F1F1F3",
    border: "#2A2D34",
  },
};

type ThemeContextType = {
  theme: any;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
  isDark: false,
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{
        theme: isDark ? darkTheme : lightTheme,
        toggleTheme,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
