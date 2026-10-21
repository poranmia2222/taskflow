"use client";

import { useMemo, useState } from "react";
import { addMonths, isSameDay, startOfMonth, toDateKey } from "@/lib/dates";
import { PRIORITY_TOKENS, type Priority, type Todo } from "@/lib/todos";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/** Used to pick the most urgent task when several land on the same day. */
const PRIORITY_RANK: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

type DaySummary = {
    /** How many tasks are due that day. */
    count: number;
    /** Highest priority among those tasks. */
    priority: Priority | null;
};

type MiniCalendarProps = {
    /** Tasks scanned for deadlines. */
    todos: Todo[];
    /** The current date, used to highlight today. */
    today: Date;
    /** Selected day as a `YYYY-MM-DD` key, or null when nothing is picked. */
    selectedDate: string | null;
    /** Called with the clicked day, or null when the selection is cleared. */
    onSelectDate: (date: string | null) => void;
    className?: string;
};

/**
 * Month calendar with a deadline marker on every day that has tasks.
 *
 * Picking a day filters the task list below it, which makes the calendar a
 * quick way to jump to a specific date.
 */
const MiniCalendar = ({
    todos,
    today,
    selectedDate,
    onSelectDate,
    className = "",
}: MiniCalendarProps) => {
    const [viewMonth, setViewMonth] = useState(() => startOfMonth(today));

    /** Deadlines grouped by day. */
    const summaries = useMemo(() => {
        const map = new Map<string, DaySummary>();

        for (const todo of todos) {
            if (!todo.dueDate) continue;

            const current = map.get(todo.dueDate) ?? { count: 0, priority: null };
            current.count += 1;

            if (
                !current.priority ||
                PRIORITY_RANK[todo.priority] > PRIORITY_RANK[current.priority]
            ) {
                current.priority = todo.priority;
            }

            map.set(todo.dueDate, current);
        }

        return map;
    }, [todos]);

    /** The six-week grid of days shown for the current month. */
    const cells = useMemo(() => {
        const year = viewMonth.getFullYear();
        const month = viewMonth.getMonth();
        const leading = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const total = Math.ceil((leading + daysInMonth) / 7) * 7;

        return Array.from(
            { length: total },
            (_, index) => new Date(year, month, 1 - leading + index),
        );
    }, [viewMonth]);

    return (
        <section
            aria-label="Calendar"
            className={`rounded-box border border-base-300 bg-base-100 p-4 ${className}`}
        >
            <header className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">
                    {viewMonth.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </h2>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => setViewMonth(addMonths(viewMonth, -1))}
                        aria-label="Previous month"
                        className="btn btn-ghost btn-xs btn-square"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMonth(startOfMonth(today))}
                        className="btn btn-ghost btn-xs"
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMonth(addMonths(viewMonth, 1))}
                        aria-label="Next month"
                        className="btn btn-ghost btn-xs btn-square"
                    >
                        ›
                    </button>
                </div>
            </header>

            <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-base-content/50">
                {WEEKDAY_LABELS.map((label) => (
                    <span key={label} className="py-1">
                        {label}
                    </span>
                ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
                {cells.map((cell) => {
                    const key = toDateKey(cell);
                    const summary = summaries.get(key);
                    const isToday = isSameDay(cell, today);
                    const isSelected = selectedDate === key;
                    const inMonth =
                        cell.getMonth() === viewMonth.getMonth() &&
                        cell.getFullYear() === viewMonth.getFullYear();

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onSelectDate(isSelected ? null : key)}
                            aria-pressed={isSelected}
                            aria-label={`${cell.toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                            })}${summary ? `, ${summary.count} tasks due` : ""}`}
                            className={`relative flex h-9 items-center justify-center rounded-lg text-xs transition-colors ${
                                isSelected
                                    ? "bg-primary font-semibold text-primary-content shadow-sm"
                                    : isToday
                                      ? "bg-primary/15 font-semibold text-primary hover:bg-primary/25"
                                      : inMonth
                                        ? "text-base-content/80 hover:bg-base-content/10"
                                        : "text-base-content/30 hover:bg-base-content/5"
                            }`}
                        >
                            <span>{cell.getDate()}</span>

                            {summary && (
                                <span
                                    aria-hidden
                                    className="absolute bottom-1 size-1.5 rounded-full"
                                    style={{
                                        background: isSelected
                                            ? "currentColor"
                                            : `var(--color-${PRIORITY_TOKENS[summary.priority ?? "low"]})`,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <p className="mt-3 flex items-center gap-1.5 text-[11px] text-base-content/50">
                <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-error"
                />
                A dot marks a day with deadlines. Pick a day to filter the list.
            </p>
        </section>
    );
};

export default MiniCalendar;
