export const THEMES = ["light", "dark"] as const;

export type Theme = (typeof THEMES)[number];

/** `localStorage` key holding the user's explicit choice. */
export const THEME_STORAGE_KEY = "taskflow-theme";

export function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark";
}

/**
 * The theme to apply before the app hydrates.
 *
 * Prefers a saved choice, then falls back to the operating system setting.
 * Kept as a string so it can be inlined into the document.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k="${THEME_STORAGE_KEY}",s=localStorage.getItem(k);var m=window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",s==="light"||s==="dark"?s:(m?"dark":"light"));}catch(e){}})();`;

/** Reads the theme currently applied to `<html>`. */
export function getAppliedTheme(): Theme {
    if (typeof document === "undefined") return "light";
    return isTheme(document.documentElement.getAttribute("data-theme"))
        ? (document.documentElement.getAttribute("data-theme") as Theme)
        : "light";
}
