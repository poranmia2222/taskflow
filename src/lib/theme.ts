export const THEMES = ["dark", "light"] as const;

export type Theme = (typeof THEMES)[number];

/** The theme the app starts in when the user has not picked one. */
export const DEFAULT_THEME: Theme = "dark";

/** `localStorage` key holding the user's explicit choice. */
export const THEME_STORAGE_KEY = "taskflow-theme";

export function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark";
}

/**
 * The theme to apply before the app hydrates.
 *
 * Prefers a saved choice, then falls back to the default (dark) theme.
 * Kept as a string so it can be inlined into the document.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k);document.documentElement.setAttribute("data-theme",s==="light"||s==="dark"?s:"${DEFAULT_THEME}");}catch(e){}})();`;

/** Reads the theme currently applied to `<html>`. */
export function getAppliedTheme(): Theme {
    if (typeof document === "undefined") return DEFAULT_THEME;
    return isTheme(document.documentElement.getAttribute("data-theme"))
        ? (document.documentElement.getAttribute("data-theme") as Theme)
        : DEFAULT_THEME;
}
