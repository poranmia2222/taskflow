"use client";

import { type ReactNode, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type RevealProps = {
    children: ReactNode;
    /** Tailwind classes for the wrapper element. */
    className?: string;
    /**
     * Delay between two revealed elements, in seconds.
     *
     * Elements marked with `data-reveal` are animated one after another; when
     * nothing is marked, the wrapper itself fades in.
     */
    stagger?: number;
    /** Seconds to wait before the tween starts. */
    delay?: number;
    /** Pixels the elements travel upward while they fade in. */
    y?: number;
    /** Seconds the tween lasts. */
    duration?: number;
    /** When the scroll trigger fires, e.g. `"top 85%"`. */
    start?: string;
};

/**
 * Fades and lifts content into view the first time it scrolls on screen.
 *
 * The tween is skipped entirely when the visitor asked for reduced motion, so
 * the page simply appears instead of moving.
 */
const Reveal = ({
    children,
    className = "",
    stagger = 0,
    delay = 0,
    y = 24,
    duration = 0.6,
    start = "top 85%",
}: RevealProps) => {
    const scope = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const media = gsap.matchMedia();

            media.add("(prefers-reduced-motion: no-preference)", () => {
                const root = scope.current;
                if (!root) return;

                const marked = Array.from(
                    root.querySelectorAll<HTMLElement>("[data-reveal]"),
                );

                const targets = marked.length > 0 ? marked : [root];

                gsap.from(targets, {
                    autoAlpha: 0,
                    y,
                    duration,
                    delay,
                    stagger,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: root,
                        start,
                        once: true,
                    },
                });
            });
        },
        { scope },
    );

    return <div ref={scope} className={className}>{children}</div>;
};

export default Reveal;
