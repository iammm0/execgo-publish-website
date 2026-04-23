"use client";

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark";
export type ThemeMode = "system" | Theme;

type ThemeContextValue = {
  themeMode: ThemeMode;
  resolvedTheme: Theme;
  setThemeMode: (mode: ThemeMode) => void;
  cycleThemeMode: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "execgo.themeMode";
const THEME_MODE_CHANGE_EVENT = "execgo.themeModeChange";

function readStoredThemeMode(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "system" || value === "light" || value === "dark") {
    return value;
  }
  return null;
}

function readThemeModeSnapshot(): ThemeMode {
  return readStoredThemeMode() ?? "system";
}

function readSystemPrefersDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function subscribeSystemThemeChange(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (!mql) {
    return () => {};
  }

  mql.addEventListener("change", onStoreChange);
  return () => {
    mql.removeEventListener("change", onStoreChange);
  };
}

function subscribeThemeModeChange(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_MODE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_MODE_CHANGE_EVENT, onStoreChange);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useSyncExternalStore<ThemeMode>(
    subscribeThemeModeChange,
    readThemeModeSnapshot,
    () => "system",
  );
  const systemPrefersDark = useSyncExternalStore(
    subscribeSystemThemeChange,
    readSystemPrefersDark,
    () => false,
  );

  const setThemeMode = (mode: ThemeMode) => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new Event(THEME_MODE_CHANGE_EVENT));
  };

  const resolvedTheme: Theme = useMemo(() => {
    if (themeMode === "system") {
      return systemPrefersDark ? "dark" : "light";
    }
    return themeMode;
  }, [systemPrefersDark, themeMode]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const cycleThemeMode = () => {
    if (themeMode === "system") {
      setThemeMode("light");
    } else if (themeMode === "light") {
      setThemeMode("dark");
    } else {
      setThemeMode("system");
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedTheme,
        setThemeMode,
        cycleThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme 必须在 ThemeProvider 内使用");
  }
  return ctx;
}
