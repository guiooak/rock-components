import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type StudTheme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface StudProviderProps {
  children: ReactNode;
  /** The active theme. `'system'` follows `prefers-color-scheme`. Defaults to `'system'`. */
  theme?: StudTheme;
}

interface StudThemeContextValue {
  theme: StudTheme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: StudTheme) => void;
}

const StudThemeContext = createContext<StudThemeContextValue | null>(null);

const SYSTEM_QUERY = '(prefers-color-scheme: dark)';

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia(SYSTEM_QUERY).matches ? 'dark' : 'light';
};

export const StudProvider = ({
  children,
  theme: themeProp = 'system',
}: StudProviderProps) => {
  const [theme, setTheme] = useState<StudTheme>(themeProp);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme);

  useEffect(() => {
    setTheme(themeProp);
  }, [themeProp]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(SYSTEM_QUERY);
    const handler = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light');
    };
    mql.addEventListener('change', handler);
    return () => {
      mql.removeEventListener('change', handler);
    };
  }, []);

  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

  const value = useMemo<StudThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme],
  );

  return (
    <StudThemeContext.Provider value={value}>
      <div data-theme={resolvedTheme}>{children}</div>
    </StudThemeContext.Provider>
  );
};

export const useStudTheme = (): StudThemeContextValue => {
  const ctx = useContext(StudThemeContext);
  if (!ctx) {
    throw new Error(
      'useStudTheme must be used inside a <StudProvider>. ' +
        'Wrap your app or test in <StudProvider> before calling this hook.',
    );
  }
  return ctx;
};

// Re-export setTheme as a separate utility consumers can ignore unless needed.
export const useSetStudTheme = (): ((theme: StudTheme) => void) => {
  const { setTheme } = useStudTheme();
  return useCallback((next: StudTheme) => setTheme(next), [setTheme]);
};
