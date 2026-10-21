"use client";

import { useSyncExternalStore } from "react";

/** `localStorage` key holding the folded state of the left sidebar. */
export const SIDEBAR_STORAGE_KEY = "taskflow:sidebar-collapsed";

const listeners = new Set<() => void>();

function emit() {
    for (const listener of listeners) listener();
}

/**
 * Reads the folded state straight from storage.
 *
 * The value is a boolean, so it stays referentially stable and React can
 * compare it with `Object.is` on every render.
 */
function getSnapshot(): boolean {
    try {
        return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "1";
    } catch {
        // Storage can be unavailable (private mode); the sidebar stays expanded.
        return false;
    }
}

/** Server snapshot: the sidebar always starts expanded. */
function getServerSnapshot(): boolean {
    return false;
}

let isStorageListenerAttached = false;

function subscribe(listener: () => void) {
    listeners.add(listener);

    // Keep other tabs in sync when the sidebar is folded elsewhere.
    if (!isStorageListenerAttached && typeof window !== "undefined") {
        isStorageListenerAttached = true;

        window.addEventListener("storage", (event) => {
            if (event.key !== SIDEBAR_STORAGE_KEY) return;

            emit();
        });
    }

    return () => listeners.delete(listener);
}

/** Folds or unfolds the sidebar and remembers the choice. */
export function setSidebarCollapsed(collapsed: boolean) {
    try {
        window.localStorage.setItem(
            SIDEBAR_STORAGE_KEY,
            collapsed ? "1" : "0",
        );
    } catch {
        // Storage can be unavailable (private mode); the choice is not kept.
    }

    emit();
}

/** Flips the sidebar between the wide and the narrow layout. */
export function toggleSidebarCollapsed() {
    setSidebarCollapsed(!getSnapshot());
}

/** Whether the left sidebar is currently folded to its icon-only rail. */
export function useSidebarCollapsed(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
