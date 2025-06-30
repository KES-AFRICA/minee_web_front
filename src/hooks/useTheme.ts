import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";

export const useTheme = () => {
  const {
    theme,
    isDark,
    currentTheme,
    setTheme,
    toggleTheme,
    initializeTheme,
    getThemeClass,
    cn,
  } = useThemeStore();

  useEffect(() => {
    const cleanup = initializeTheme();
    return cleanup;
  }, [initializeTheme]);

  return {
    theme,
    isDark,
    currentTheme,
    setTheme,
    toggleTheme,
    getThemeClass,
    cn,
    colors: currentTheme.colors,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    typography: currentTheme.typography,
  };
};
