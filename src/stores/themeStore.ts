import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { lightTheme, darkTheme } from '../themes/themes';
import type { Theme, ThemeConfig } from '../types/theme';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  currentTheme: ThemeConfig;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
  getThemeClass: (lightClass: string, darkClass: string) => string;
  cn: (...classes: (string | undefined | false)[]) => string;
}

const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const getIsDark = (theme: Theme): boolean => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme === 'dark';
};

const getCurrentTheme = (theme: Theme): ThemeConfig => {
  const isDark = getIsDark(theme);
  return isDark ? darkTheme : lightTheme;
};

// Fonction utilitaire pour combiner les classes CSS
const classNames = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: false,
      currentTheme: lightTheme,
      
      setTheme: (theme: Theme) => {
        const isDark = getIsDark(theme);
        const currentTheme = getCurrentTheme(theme);
        
        // Mettre à jour le DOM
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement;
          root.classList.toggle('dark', isDark);

          root.setAttribute('data-theme', theme);
        }
        
        set({
          theme,
          isDark,
          currentTheme,
        });
      },
      
      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },
      
      initializeTheme: () => {
        const { theme, setTheme } = get();
        
        // Écouter les changements du système
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = () => {
            if (theme === 'system') {
              setTheme('system');
            }
          };
          
          mediaQuery.addEventListener('change', handleChange);
          
          // Cleanup function
          return () => mediaQuery.removeEventListener('change', handleChange);
        }
        
        // Initialiser le thème
        setTheme(theme);
      },
    // Helper pour choisir entre classe light/dark
      getThemeClass: (lightClass: string, darkClass: string) => {
        const { isDark } = get();
        return isDark ? darkClass : lightClass;
      },
      
      // Fonction utilitaire pour combiner les classes
      cn: (...classes: (string | undefined | false)[]) => {
        return classNames(...classes);
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);