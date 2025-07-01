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

// Utility function to combine CSS classes
const classNames = (...classes: (string | undefined | false)[]): string => {
    return classes.filter(Boolean).join(' ');
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'system',
            isDark: false, // Will be set correctly in initializeTheme
            currentTheme: lightTheme, // Will be set correctly in initializeTheme

            setTheme: (theme: Theme) => {
                const isDark = getIsDark(theme);
                const currentTheme = getCurrentTheme(theme);

                // Update DOM
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
                // Handle system theme properly - toggle between light and dark
                if (theme === 'system') {
                    const systemIsDark = getSystemTheme();
                    const newTheme = systemIsDark ? 'light' : 'dark';
                    get().setTheme(newTheme);
                } else {
                    const newTheme = theme === 'light' ? 'dark' : 'light';
                    get().setTheme(newTheme);
                }
            },

            initializeTheme: () => {
                // Get the persisted theme from localStorage first
                const { theme, setTheme } = get();

                // Listen to system theme changes
                if (typeof window !== 'undefined') {
                    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                    const handleChange = () => {
                        const currentTheme = get().theme;
                        if (currentTheme === 'system') {
                            // Force re-evaluation by calling setTheme with 'system'
                            setTheme('system');
                        }
                    };

                    mediaQuery.addEventListener('change', handleChange);

                    // Store cleanup function for potential use
                    (window as any).__themeCleanup = () => mediaQuery.removeEventListener('change', handleChange);
                }

                // Initialize theme with the persisted value from localStorage
                // This will properly set isDark and currentTheme based on the saved theme
                setTheme(theme);
            },

            // Helper to choose between light/dark class
            getThemeClass: (lightClass: string, darkClass: string) => {
                const { isDark } = get();
                return isDark ? darkClass : lightClass;
            },

            // Utility function to combine classes
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