"use client";

import { useMemo } from "react";
import { differenceInDays, formatDueLabel, parseDateKey } from "@/lib/dates";
import {
    PRIORITY_TOKENS,
    getOverdueTodos,
    getUpcomingTodos,
    type Todo,
    type TodoState,
} from "@/lib/todos";

/** How far ahead the list looks when no day is picked in the calendar. */
const LOOKAHEAD_DAYS = 7;

type UpcomingTasksProps = {
    /** Every task in the workspace. */
    todos: Todo[];
    /** The current date, used for the overdue and upcoming windows. */
    today: Date;
    /** Day picked in the calendar, as a `YYYY-MM-DD` key. */
    selectedDate: string | null;
    /** Clears the calendar selection. */
    onClearSelection: () => void;
    /** The task the timer is focused on. */
    focusTaskId: string | null;
    /** Focuses the timer on a task, or clears it with null. */
    onFocusTask: (id: string | null) => void;
    /** Marks a task as done. */
    onToggle: (id: string) => void;
    /** Moves a task to another status. */
    onMove: (id: string, status: TodoState) => void;
    className?: string;
};

type TaskRowProps = {
    todo: Todo;
    today: Date;
    isFocused: boolean;
    onFocus: () => void;
    onToggle: () => void;
    onMove: (status: TodoState) => void;
};

const TaskRow = ({
    todo,
    today,
    isFocused,
    onFocus,
    onToggle,
    onMove,
}: TaskRowProps) => {
    const dueLabel = formatDueLabel(todo.dueDate, todo.due, today);
    const dueDate = todo.dueDate ? parseDateKey(todo.dueDate) : null;
    const isOverdue =
        dueDate !== null &&
        todo.status !== "completed" &&
        differenceInDays(dueDate, today) < 0;

    return (
        <li
            className={`flex items-start gap-2 rounded-box border border-base-300 bg-base-200 px-2.5 py-2 transition-colors ${
                isFocused
                    ? "border-primary/40 bg-primary/10"
                    : "hover:bg-base-300"
            }`}
        >
            <span
                aria-hidden
                className="mt-1.5 size-2 shrink-0 rounded-full"
                style={{ background: `var(--color-${PRIORITY_TOKENS[todo.priority]})` }}
            />

            <div className="min-w-0 flex-1">
                <button
                    type="button"
                    onClick={onFocus}
                    aria-pressed={isFocused}
                    className={`block w-full truncate text-left text-xs font-medium ${
                        todo.status === "completed"
                            ? "text-base-content/50 line-through"
                            : isFocused
                              ? "text-primary"
                              : "hover:text-primary"
                    }`}
                >
                    {todo.title}
                </button>

                <p className="mt-0.5 flex flex-wrap items-center gap-x-1 text-[11px] text-base-content/60">
                    <span className="truncate">{todo.project}</span>
                    <span aria-hidden>·</span>
                    <span className={isOverdue ? "font-medium text-error" : ""}>
                        {isOverdue ? `Overdue · ${dueLabel}` : dueLabel}
                    </span>
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
                {todo.status !== "completed" && (
                    <button
                        type="button"
                        onClick={() => onMove("in-progress")}
                        aria-label={`Start "${todo.title}"`}
                        title="Move to In progress"
                        className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-info"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="size-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                        </svg>
                    </button>
                )}

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={`Mark "${todo.title}" as ${
                        todo.status === "completed" ? "incomplete" : "complete"
                    }`}
                    title={todo.status === "completed" ? "Reopen task" : "Mark as done"}
                    className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-success"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.2}
                        stroke="currentColor"
                        aria-hidden
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>
                </button>
            </div>
        </li>
    );
};

/**
 * The list of tasks that need attention next.
 *
 * Without a calendar selection it shows what is overdue plus the next seven
 * days. Picking a day in the calendar narrows the list to that day instead.
 */
const UpcomingTasks = ({
    todos,
    today,
    selectedDate,
    onClearSelection,
    focusTaskId,
    onFocusTask,
    onToggle,
    onMove,
    className = "",
}: UpcomingTasksProps) => {
    const overdue = useMemo(() => getOverdueTodos(todos, today), [todos, today]);
    const upcoming = useMemo(
        () => getUpcomingTodos(todos, LOOKAHEAD_DAYS, today),
        [todos, today],
    );

    const selected = useMemo(
        () =>
            selectedDate
                ? todos.filter(
                      (todo) =>
                          todo.dueDate === selectedDate &&
                          todo.status !== "completed",
                  )
                : [],
        [todos, selectedDate],
    );

    const isFiltered = selectedDate !== null;

    return (
        <section
            aria-label="Upcoming tasks"
            className={`rounded-box border border-base-300 bg-base-100 p-4 ${className}`}
        >
            <header className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">
                    {isFiltered
                        ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
                              "en-US",
                              { weekday: "long", month: "short", day: "numeric" },
                          )
                        : "Next up"}
                </h2>

                {isFiltered ? (
                    <button
                        type="button"
                        onClick={onClearSelection}
                        className="btn btn-ghost btn-xs"
                    >
                        Clear
                    </button>
                ) : (
                    <span className="text-[11px] text-base-content/50">
                        Next {LOOKAHEAD_DAYS} days
                    </span>
                )}
            </header>

            {isFiltered ? (
                selected.length === 0 ? (
                    <p className="py-6 text-center text-xs text-base-content/50">
                        Nothing is due on this day.
                    </p>
                ) : (
                    <ul className="mt-3 space-y-2">
                        {selected.map((todo) => (
                            <TaskRow
                                key={todo.id}
                                todo={todo}
                                today={today}
                                isFocused={focusTaskId === todo.id}
                                onFocus={() => onFocusTask(todo.id)}
                                onToggle={() => onToggle(todo.id)}
                                onMove={(status) => onMove(todo.id, status)}
                            />
                        ))}
                    </ul>
                )
            ) : (
                <>
                    {overdue.length > 0 && (
                        <div className="mt-3">
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-error">
                                Overdue
                            </p>
                            <ul className="space-y-2">
                                {overdue.map((todo) => (
                                    <TaskRow
                                        key={todo.id}
                                        todo={todo}
                                        today={today}
                                        isFocused={focusTaskId === todo.id}
                                        onFocus={() => onFocusTask(todo.id)}
                                        onToggle={() => onToggle(todo.id)}
                                        onMove={(status) => onMove(todo.id, status)}
                                    />
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={overdue.length > 0 ? "mt-4" : "mt-3"}>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-base-content/50">
                            Upcoming
                        </p>

                        {upcoming.length === 0 ? (
                            <p className="py-4 text-center text-xs text-base-content/50">
                                Nothing due in the next {LOOKAHEAD_DAYS} days.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {upcoming.map((todo) => (
                                    <TaskRow
                                        key={todo.id}
                                        todo={todo}
                                        today={today}
                                        isFocused={focusTaskId === todo.id}
                                        onFocus={() => onFocusTask(todo.id)}
                                        onToggle={() => onToggle(todo.id)}
                                        onMove={(status) => onMove(todo.id, status)}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default UpcomingTasks;
