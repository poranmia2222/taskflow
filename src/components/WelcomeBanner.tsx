"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useSession } from "@/lib/auth-client";
import { useToday } from "@/lib/clock";
import { toDateKey } from "@/lib/dates";
import { getTodoCounts, type Todo } from "@/lib/todos";

type WelcomeBannerProps = {
    /** Every task in the workspace, used for the quick stats. */
    todos: Todo[];
    /** Opens the "new task" dialog. */
    onCreateTask: () => void;
    className?: string;
};

/** Time-of-day greeting for the given hour. */
function getGreeting(hour: number): string {
    if (hour < 5) return "Still up?";
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}

type StatTileProps = {
    label: string;
    value: number;
    /** Tailwind classes for the accent dot. */
    dotClass: string;
};

/** A single number that counts up when it first appears. */
const AnimatedNumber = ({ value, className = "" }: { value: number; className?: string }) => {
    const display = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const media = gsap.matchMedia();

            media.add("(prefers-reduced-motion: no-preference)", () => {
                const counter = { value: 0 };

                gsap.to(counter, {
                    value,
                    duration: 0.9,
                    ease: "power2.out",
                    onUpdate: () => {
                        if (display.current) {
                            display.current.textContent = String(
                                Math.round(counter.value),
                            );
                        }
                    },
                });
            });
        },
        { dependencies: [value] },
    );

    return (
        <span ref={display} className={className}>
            {value}
        </span>
    );
};

const StatTile = ({ label, value, dotClass }: StatTileProps) => (
    <div className="rounded-box border border-base-300 bg-base-200 px-3 py-2.5">
        <dt className="flex items-center gap-1.5 text-[11px] font-medium text-base-content/60">
            <span className={`size-1.5 rounded-full ${dotClass}`} aria-hidden />
            {label}
        </dt>
        <dd className="mt-0.5 text-xl font-bold tabular-nums">
            <AnimatedNumber value={value} />
        </dd>
    </div>
);

/**
 * The greeting shown at the top of the workspace.
 *
 * The time-of-day greeting and the date are only known in the browser, so the
 * banner renders a neutral headline on the server and fills in the details
 * once the client takes over.
 */
const WelcomeBanner = ({
    todos,
    onCreateTask,
    className = "",
}: WelcomeBannerProps) => {
    const scope = useRef<HTMLElement>(null);
    const today = useToday();
    const { data: session } = useSession();

    const counts = getTodoCounts(todos);

    const dueToday = today
        ? todos.filter(
              (todo) =>
                  todo.dueDate === toDateKey(today) &&
                  todo.status !== "completed",
          ).length
        : 0;

    const firstName =
        session?.user?.name?.split(" ")[0]?.trim() || "there";

    const greeting = today ? getGreeting(today.getHours()) : "Welcome back";
    const dateLabel = today
        ? today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
          })
        : "Your workspace at a glance";

    useGSAP(
        () => {
            const media = gsap.matchMedia();

            media.add("(prefers-reduced-motion: no-preference)", () => {
                const timeline = gsap.timeline({
                    defaults: { ease: "power3.out" },
                });

                timeline
                    .from(scope.current, {
                        autoAlpha: 0,
                        y: 18,
                        duration: 0.5,
                    })
                    .from(
                        "[data-banner-copy] > *",
                        {
                            autoAlpha: 0,
                            y: 14,
                            duration: 0.45,
                            stagger: 0.07,
                        },
                        "-=0.3",
                    )
                    .from(
                        "[data-banner-stat]",
                        {
                            autoAlpha: 0,
                            y: 12,
                            duration: 0.4,
                            stagger: 0.06,
                        },
                        "-=0.32",
                    );

                // The glow orbs drift slowly behind the content.
                gsap.to("[data-banner-orb]", {
                    xPercent: 14,
                    yPercent: -10,
                    scale: 1.15,
                    duration: 8,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    stagger: 1.4,
                });
            });
        },
        { scope },
    );

    return (
        <section
            ref={scope}
            data-banner-root
            aria-label="Welcome"
            className={`relative overflow-hidden rounded-box border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8 ${className}`}
        >
            {/* Decorative glow. */}
            <div
                data-banner-orb
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-28 size-72 rounded-full bg-primary/25 blur-3xl"
            />
            <div
                data-banner-orb
                aria-hidden
                className="pointer-events-none absolute -bottom-32 -left-24 size-64 rounded-full bg-secondary/25 blur-3xl"
            />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div data-banner-copy className="min-w-0">
                    <p className="text-sm font-medium text-primary">{greeting}</p>
                    <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                        {firstName === "there" ? "Ready to get things done?" : firstName}
                    </h1>
                    <p className="mt-2 text-sm text-base-content/60">{dateLabel}</p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={onCreateTask}
                            className="btn btn-primary btn-sm"
                        >
                            + New task
                        </button>
                        <Link
                            href="/analytics"
                            className="btn btn-outline btn-sm"
                        >
                            View analytics
                        </Link>
                    </div>
                </div>

                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
                    <div data-banner-stat>
                        <StatTile
                            label="Due today"
                            value={dueToday}
                            dotClass="bg-warning"
                        />
                    </div>
                    <div data-banner-stat>
                        <StatTile
                            label="In progress"
                            value={counts["in-progress"]}
                            dotClass="bg-info"
                        />
                    </div>
                    <div data-banner-stat>
                        <StatTile
                            label="Completed"
                            value={counts.completed}
                            dotClass="bg-success"
                        />
                    </div>
                    <div data-banner-stat>
                        <StatTile
                            label="Total"
                            value={counts.all}
                            dotClass="bg-primary"
                        />
                    </div>
                </dl>
            </div>
        </section>
    );
};

export default WelcomeBanner;
