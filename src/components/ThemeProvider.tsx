"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import { isTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Tiny external store over `document.documentElement[data-theme]`.
 *
 * The inline script in the document head is the single source of truth: it
 * applies the saved (or system) theme before first paint. React then reads it
 * through `useSyncExternalStore` rather than during render, which is what keeps
 * the hydrated tree identical to the server markup.
 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function emit() {
    for (const listener of listeners) listener();
}

/** Server snapshot: the value the document is rendered with. */
function getServerSnapshot(): Theme {
    return "light";
}

function getSnapshot(): Theme {
    const applied = document.documentElement.getAttribute("data-theme");
    return isTheme(applied) ? applied : "light";
}

function readStoredTheme(): Theme | null {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return isTheme(stored) ? stored : null;
    } catch {
        return null;
    }
}

function persistTheme(theme: Theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        // Storage can be unavailable (private mode); the theme still applies.
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const setTheme = useCallback((next: Theme) => {
        document.documentElement.setAttribute("data-theme", next);
        persistTheme(next);
        emit();
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(getSnapshot() === "dark" ? "light" : "dark");
    }, [setTheme]);

    // Follow the OS setting while the user has not chosen a theme explicitly.
    useEffect(() => {
        const media = window.matchMedia("(prefers-color-scheme: dark)");

        const onChange = (event: MediaQueryListEvent) => {
            if (readStoredTheme()) return;

            document.documentElement.setAttribute(
                "data-theme",
                event.matches ? "dark" : "light",
            );
            emit();
        };

        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    // Keep other tabs in sync when the choice changes elsewhere.
    useEffect(() => {
        const onStorage = (event: StorageEvent) => {
            if (event.key !== THEME_STORAGE_KEY) return;

            document.documentElement.setAttribute(
                "data-theme",
                isTheme(event.newValue) ? event.newValue : "light",
            );
            emit();
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
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
