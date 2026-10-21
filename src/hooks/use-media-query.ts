"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Tracks a CSS media query.
 *
 * The server snapshot is always `false`, so the markup rendered on the server
 * matches the first client render. The real value arrives right after mount.
 */
export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onStoreChange: () => void) => {
            const list = window.matchMedia(query);
            list.addEventListener("change", onStoreChange);

            return () => list.removeEventListener("change", onStoreChange);
        },
        [query],
    );

    const getSnapshot = useCallback(
        () => window.matchMedia(query).matches,
        [query],
    );

    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
