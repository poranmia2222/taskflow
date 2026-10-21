"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Todo } from "@/lib/todos";

/** Selectable session lengths, in minutes. */
const PRESETS = [15, 25, 45, 60];

type FocusTimerProps = {
    /** The task the session is focused on, if any. */
    task?: Todo | null;
    className?: string;
};

/** `MM:SS` for a number of seconds. */
const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;

    return `${`${minutes}`.padStart(2, "0")}:${`${rest}`.padStart(2, "0")}`;
};

/**
 * Countdown timer for a focused work session.
 *
 * The end time is stored as a timestamp instead of a tick counter, so the
 * countdown stays accurate even when the tab is throttled or backgrounded.
 */
const FocusTimer = ({ task = null, className = "" }: FocusTimerProps) => {
    const [duration, setDuration] = useState(25);
    const [remaining, setRemaining] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    /** Timestamp the current session ends at, while it is running. */
    const endsAtRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isRunning) return;

        const tick = () => {
            const endsAt = endsAtRef.current;
            if (endsAt === null) return;

            const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
            setRemaining(left);

            if (left === 0) {
                endsAtRef.current = null;
                setIsRunning(false);
                setIsComplete(true);
            }
        };

        const id = window.setInterval(tick, 250);

        return () => window.clearInterval(id);
    }, [isRunning]);

    const start = () => {
        endsAtRef.current = Date.now() + remaining * 1000;
        setIsComplete(false);
        setIsRunning(true);
    };

    const pause = () => {
        endsAtRef.current = null;
        setIsRunning(false);
    };

    const reset = () => {
        endsAtRef.current = null;
        setIsRunning(false);
        setIsComplete(false);
        setRemaining(duration * 60);
    };

    const selectDuration = (minutes: number) => {
        setDuration(minutes);
        setRemaining(minutes * 60);
        setIsRunning(false);
        setIsComplete(false);
        endsAtRef.current = null;
    };

    const total = duration * 60;
    const progress = total === 0 ? 0 : Math.round((remaining / total) * 100);

    return (
        <section
            aria-label="Focus timer"
            className={`rounded-box border border-base-300 bg-base-100 p-4 ${className}`}
        >
            <header className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Focus timer</h2>

                {isComplete && (
                    <span className="badge badge-success badge-soft badge-sm">
                        Session complete
                    </span>
                )}
            </header>

            <div className="mt-3 flex flex-col items-center gap-3">
                <div
                    className={`radial-progress bg-base-200 ${
                        isRunning ? "text-primary" : "text-base-content/30"
                    }`}
                    style={
                        {
                            "--value": progress,
                            "--size": "7.5rem",
                            "--thickness": "0.45rem",
                        } as CSSProperties
                    }
                    role="timer"
                    aria-label={`${formatTime(remaining)} remaining`}
                >
                    <span className="text-2xl font-bold tabular-nums">
                        {formatTime(remaining)}
                    </span>
                </div>

                <p className="min-h-4 text-center text-xs text-base-content/60">
                    {task ? (
                        <>
                            Focusing on{" "}
                            <span className="font-medium text-base-content/80">
                                {task.title}
                            </span>
                        </>
                    ) : (
                        "Pick a task below to focus the session on it."
                    )}
                </p>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={isRunning ? pause : start}
                        aria-label={isRunning ? "Pause the timer" : "Start the timer"}
                        className="btn btn-primary btn-sm btn-circle"
                    >
                        {isRunning ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden
                            >
                                <path d="M7 5h3.5v14H7V5Zm6.5 0H17v14h-3.5V5Z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden
                            >
                                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                            </svg>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={reset}
                        aria-label="Reset the timer"
                        className="btn btn-ghost btn-sm btn-square"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.75 9.75 4.5 15m0 0V9.75M4.5 15h5.25M15 4.5v5.25H9.75M19.5 9.75v5.25h-5.25"
                            />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1">
                    {PRESETS.map((minutes) => (
                        <button
                            key={minutes}
                            type="button"
                            onClick={() => selectDuration(minutes)}
                            aria-pressed={duration === minutes}
                            className={`btn btn-xs ${
                                duration === minutes ? "btn-neutral" : "btn-ghost"
                            }`}
                        >
                            {minutes}m
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FocusTimer;
