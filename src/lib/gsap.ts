"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

/*
 * GSAP only runs in the browser. The plugin registration is guarded so this
 * module can be imported by client components that are still server-rendered
 * for the initial HTML: nothing animates until the component reaches the
 * browser, and the server markup stays untouched.
 */
if (typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
}

/** Easing curves shared by the animations, so the motion feels consistent. */
export const EASE = {
    /** Entering the screen. */
    enter: "power3.out",
    /** Leaving the screen. */
    exit: "power2.inOut",
    /** Small nudges such as hover feedback. */
    soft: "power2.out",
} as const;

/** Durations in seconds. */
export const DURATION = {
    fast: 0.25,
    base: 0.5,
    slow: 0.8,
} as const;

export { gsap, ScrollTrigger, useGSAP };
