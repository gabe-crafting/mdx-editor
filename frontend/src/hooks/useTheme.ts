import { useState, useEffect, useCallback } from 'react';
import { EventsOn, WindowSetLightTheme, WindowSetDarkTheme, WindowSetSystemDefaultTheme } from '../../wailsjs/runtime/runtime';

type Theme = 'light' | 'dark' | 'default';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to 'default'
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved || 'default';
  });

  // Apply theme to document
  const applyTheme = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === 'default') {
      // Check OS preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
        WindowSetDarkTheme(); // Explicitly set to dark if OS is dark (Windows only)
      } else {
        root.classList.remove('dark');
        WindowSetLightTheme(); // Explicitly set to light if OS is light (Windows only)
      }
    } else if (newTheme === 'dark') {
      root.classList.add('dark');
      WindowSetDarkTheme(); // Set window to dark theme (Windows only)
    } else {
      root.classList.remove('dark');
      WindowSetLightTheme(); // Set window to light theme (Windows only)
    }
    
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    // Apply theme immediately on mount
    applyTheme(theme);
    
    // Listen for OS theme changes when using 'default'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'default') {
        applyTheme('default');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme, applyTheme]);

  // Listen for menu events
  useEffect(() => {
    const unsubscribeLight = EventsOn('menu:view:theme:light', () => {
      applyTheme('light');
    });
    
    const unsubscribeDark = EventsOn('menu:view:theme:dark', () => {
      applyTheme('dark');
    });
    
    const unsubscribeDefault = EventsOn('menu:view:theme:default', () => {
      applyTheme('default');
    });

    return () => {
      unsubscribeLight();
      unsubscribeDark();
      unsubscribeDefault();
    };
  }, [applyTheme]);

  return { theme, setTheme: applyTheme };
}

