import React, { useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentTheme, isDark } = useTheme();
  
  useEffect(() => {
    // Appliquer les variables CSS
    const root = document.documentElement;
    const { colors, spacing, borderRadius, typography } = currentTheme;
    
    // Couleurs
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Espacement
    Object.entries(spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Border radius
    Object.entries(borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Typographie
    root.style.setProperty('--font-family', typography.fontFamily);
    Object.entries(typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--text-${key}`, value);
    });
    
    // Classe dark sur le body
    document.body.classList.toggle('dark', isDark);
  }, [currentTheme, isDark]);
  
  return <>{children}</>;
};