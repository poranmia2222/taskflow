"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    getAppliedTheme,
    isTheme,
    THEME_STORAGE_KEY,
    type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const applyTheme = (theme: Theme) => {
    document.documentElement.setAttribute("data-theme", theme);
};

/**
 * Holds the active theme.
 *
 * The inline script in the document head applies the stored theme before paint,
 * so this only mirrors what is already on screen — no flash of the wrong theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    // Seeded lazily from the DOM so the first client render matches the markup.
    const [theme, setThemeState] = useState<Theme>(getAppliedTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    // Follow the OS setting while the user has not made an explicit choice.
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const onChange = (event: MediaQueryListEvent) => {
            let stored: string | null = null;
            try {
                stored = localStorage.getItem(THEME_STORAGE_KEY);
            } catch {
                stored = null;
            }

            if (isTheme(stored)) return;

            const next: Theme = event.matches ? "dark" : "light";
            setThemeState(next);
        };

        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    const setTheme = useCallback((next: Theme) => {
        setThemeState(next);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, next);
        } catch {
            // Storage can be unavailable (private mode); the theme still applies.
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((current) => {
            const next: Theme = current === "dark" ? "light" : "dark";
            try {
                localStorage.setItem(THEME_STORAGE_KEY, next);
            } catch {
                // Ignore storage failures.
            }
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside a ThemeProvider");
    }
    return context;
}
