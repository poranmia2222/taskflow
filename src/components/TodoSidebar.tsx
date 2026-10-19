"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { STATUS_LABELS, TODO_STATUSES, getTodoCounts, type Todo, type TodoStatus } from "@/lib/todos";

type TodoSidebarProps = {
    /** Tasks used to compute the status counts. Omit to use the built-in sample data. */
    todos?: Todo[];
    /** Controlled active status. Omit to let the sidebar manage it internally. */
    activeStatus?: TodoStatus;
    /** Called with the new status whenever the user picks a filter. */
    onStatusChange?: (status: TodoStatus) => void;
    /** Status shown the first time when the sidebar is uncontrolled. */
    defaultStatus?: TodoStatus;
    /** Set to false to hide the "Progress" section. */
    showProgress?: boolean;
    /** Set to false to hide the TaskFlow logo. */
    showLogo?: boolean;
    /** Extra content rendered between the status list and the progress card. */
    children?: ReactNode;
    className?: string;
};

const STATUS_ICONS: Record<TodoStatus, ReactNode> = {
    all: (
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
                d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.008v.008H3.75V6.75Zm0 5.25h.008v.008H3.75V12Zm0 5.25h.008v.008H3.75v-.008Z"
            />
        </svg>
    ),
    pending: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden
        >
            <circle cx="12" cy="12" r="8.25" />
        </svg>
    ),
    "in-progress": (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            aria-hidden
        >
            <circle cx="12" cy="12" r="8.25" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 1.75" />
        </svg>
    ),
    completed: (
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
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    ),
};

const STATUS_ICON_COLORS: Record<TodoStatus, string> = {
    all: "text-base-content/50",
    pending: "text-warning",
    "in-progress": "text-info",
    completed: "text-success",
};

const TodoSidebar = ({
    todos = [],
    activeStatus,
    onStatusChange,
    defaultStatus = "all",
    showProgress = true,
    showLogo = true,
    children,
    className = "",
}: TodoSidebarProps) => {
    const [internalStatus, setInternalStatus] = useState<TodoStatus>(defaultStatus);
    const isControlled = activeStatus !== undefined;
    const currentStatus = isControlled ? activeStatus : internalStatus;

    const counts = getTodoCounts(todos ?? []);
    const completed = counts.completed;
    const total = counts.all;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    const handleStatusChange = (status: TodoStatus) => {
        if (!isControlled) {
            setInternalStatus(status);
        }
        onStatusChange?.(status);
    };

    return (
        <aside
            className={`flex h-full min-h-screen w-72 shrink-0 flex-col gap-6 overflow-y-auto border-r border-base-200 bg-base-100 px-4 py-6 ${className}`}
        >
            {showLogo && (
                <Link href="/" className="flex items-center gap-2 px-2 text-lg font-bold">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary text-sm text-primary-content">
                        ✓
                    </span>
                    TaskFlow
                </Link>
            )}

            <nav aria-label="Filter todos by status" className="flex-1">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                    Status
                </p>
                <ul className="mt-2 space-y-1">
                    {TODO_STATUSES.map((status) => {
                        const isActive = status === currentStatus;

                        return (
                            <li key={status}>
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange(status)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`flex w-full items-center gap-3 rounded-box px-3 py-2.5 text-sm transition-colors ${
                                        isActive
                                            ? "bg-primary/10 font-semibold text-primary"
                                            : "text-base-content/80 hover:bg-base-200"
                                    }`}
                                >
                                    <span
                                        className={
                                            isActive ? "text-primary" : STATUS_ICON_COLORS[status]
                                        }
                                    >
                                        {STATUS_ICONS[status]}
                                    </span>
                                    <span className="flex-1 text-left">{STATUS_LABELS[status]}</span>
                                    <span
                                        className={`badge badge-sm tabular-nums ${
                                            isActive ? "badge-primary" : "badge-ghost"
                                        }`}
                                    >
                                        {counts[status]}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {children}

            {showProgress && (
                <section
                    aria-label="Todo progress"
                    className="rounded-box border border-base-200 bg-base-200/40 p-4"
                >
                    <div className="flex items-baseline justify-between gap-2">
                        <h2 className="text-sm font-semibold">Progress</h2>
                        <span className="text-xs font-medium text-base-content/60">
                            {completed}/{total} done
                        </span>
                    </div>
                    <progress
                        className="progress progress-primary mt-3 w-full"
                        value={progress}
                        max={100}
                        aria-label={`${progress}% of tasks completed`}
                    />
                    <p className="mt-2 text-xs text-base-content/60">
                        {progress}% of all tasks completed
                    </p>
                </section>
            )}
        </aside>
    );
};

export default TodoSidebar;
