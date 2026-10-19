"use client";

import { useTheme } from "@/components/ThemeProvider";

const SunIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
    </svg>
);

const MoonIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        />
    </svg>
);

type ThemeToggleProps = {
    /** Visual style; `menu` is a plain row for dropdowns. */
    variant?: "button" | "menu";
    className?: string;
};

const ThemeToggle = ({ variant = "button", className = "" }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const label = isDark ? "Switch to light theme" : "Switch to dark theme";

    if (variant === "menu") {
        return (
            <button type="button" onClick={toggleTheme} className={className}>
                {isDark ? SunIcon : MoonIcon}
                {isDark ? "Light theme" : "Dark theme"}
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            className={`btn btn-ghost btn-circle ${className}`}
        >
            {isDark ? SunIcon : MoonIcon}
        </button>
    );
};

export default ThemeToggle;
