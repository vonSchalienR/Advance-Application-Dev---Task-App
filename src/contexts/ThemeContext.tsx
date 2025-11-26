import { createContext, useState, useContext } from "react";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

export const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
  const [isDark, setIsDark] = useState(false);
  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleTheme: () => setIsDark((v) => !v),
        theme: isDark ? DarkTheme : DefaultTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
