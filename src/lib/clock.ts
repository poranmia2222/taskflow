"use client";

import { useSyncExternalStore } from "react";

/** No-op subscription: "today" never changes while the page is open. */
const subscribeToClock = () => () => {};

/** A stable snapshot per day, so React does not re-render on every read. */
let cachedToday: Date | null = null;
let cachedDay = "";

/**
 * Today's date, cached so that repeated reads return the very same object.
 *
 * The cache is invalidated once the calendar day changes, which keeps the
 * snapshot referentially stable for React.
 */
export function getClockSnapshot(): Date | null {
    const now = new Date();
    const day = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

    if (cachedDay !== day) {
        cachedDay = day;
        cachedToday = now;
    }

    return cachedToday;
}

/**
 * The current date, or `null` during the server render and the first client
 * paint.
 *
 * Components must treat `null` as "not ready yet" so the markup rendered on the
 * server always matches the first client render.
 */
export function useToday(): Date | null {
    return useSyncExternalStore(subscribeToClock, getClockSnapshot, () => null);
}
