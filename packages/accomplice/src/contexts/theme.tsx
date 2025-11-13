import type { ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useState } from 'react';
import { isFunction } from 'remeda';

export const ThemeEnum = {
  light: 'light',
  dark: 'dark',
} as const;

export type Theme = keyof typeof ThemeEnum;
export type ThemeValue = Theme | null;

const MEDIA_QUERY = '(prefers-color-scheme: dark)' as const;
const THEME_KEY = 'iheart-theme' as const;

export const ThemeContext = createContext<ThemeValue>(null);

export function ThemeProvider({
  children,
  hint,
}: {
  hint?: ThemeValue;
  children: ReactNode;
}) {
  const [themeValue, setThemeValue] = useState(() => hint ?? 'light');

  const handleThemeChange = useCallback(
    (event: MediaQueryListEvent) => {
      const themeValue: Theme = event.matches ? 'dark' : 'light';
      setThemeValue(themeValue);
      if (window?.localStorage) {
        localStorage.setItem(THEME_KEY, themeValue);
      }
    },
    [setThemeValue],
  );

  useEffect(() => {
    const prefersDark = window.matchMedia(MEDIA_QUERY);

    const initialThemeEvent = new MediaQueryListEvent('change', {
      media: prefersDark.media,
      matches: prefersDark.matches,
    });

    handleThemeChange(initialThemeEvent);

    if (isFunction(prefersDark.addEventListener)) {
      prefersDark.addEventListener('change', handleThemeChange);
    } else {
      // For Safari and older browsers
      prefersDark.addListener(handleThemeChange);
    }

    return () => {
      if (isFunction(prefersDark.removeEventListener)) {
        prefersDark.removeEventListener('change', handleThemeChange);
      } else {
        prefersDark.removeListener(handleThemeChange);
      }
    };
  }, [handleThemeChange]);

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): Theme {
  const ctx = use(ThemeContext);

  if (!ctx) {
    if (window?.localStorage) {
      const themeValue = window.localStorage.getItem(THEME_KEY);

      if (themeValue) {
        return themeValue as Theme;
      }
    }
    /**
     * I'm not positive how "safe" this is long-term... but it should be fine for now.
     *
     * It is important for this hook to throw an error if there's no theme provided at runtime in an
     * app but in test environments, it's mostly fine to rely on a fallback so we don't have to wrap
     * every test with ThemeProvider. That's probably the better long-term solution, using existing
     * patterns for custom render functions in the `test-util.tsx` file.
     */
    if (import.meta.env.MODE === 'test') {
      // In test environments, we can default to 'light'
      return 'light';
    }

    throw new Error('useTheme() must be used within a ThemeProvider');
  }
  return ctx;
}
