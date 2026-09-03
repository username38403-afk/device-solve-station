import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const themeOptions = [
  { value: "default", label: "Default", description: "The original FixMyTech look" },
  { value: "light", label: "Light", description: "Bright, clean, and focused" },
  { value: "dark", label: "Dark", description: "Comfortable contrast for low light" },
  { value: "illustration", label: "Illustration", description: "Creative color with a professional edge" },
] as const;

export type AppTheme = (typeof themeOptions)[number]["value"];

type ThemeContextValue = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  hydrated: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_STORAGE_KEY = "fixmytech-theme";

function isAppTheme(value: string | null): value is AppTheme {
  return themeOptions.some((option) => option.value === value);
}

function applyTheme(theme: AppTheme) {
  const root = document.documentElement;
  root.dataset["theme"] = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme === "dark" ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("default");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = isAppTheme(storedTheme) ? storedTheme : "default";
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    setHydrated(true);
  }, []);

  const setTheme = (nextTheme: AppTheme) => {
    setThemeState(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const value = useMemo(() => ({ theme, setTheme, hydrated }), [theme, hydrated]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}