"use client";

import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
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
    /** Renders the narrow, icon-only version of the sidebar. */
    collapsed?: boolean;
    /** Called when the collapse button is pressed. Omit to hide the button. */
    onToggleCollapsed?: () => void;
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

const CHEVRON_LEFT = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const CHEVRON_RIGHT = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-5"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const TodoSidebar = ({
    todos = [],
    activeStatus,
    onStatusChange,
    defaultStatus = "all",
    showProgress = true,
    showLogo = true,
    children,
    collapsed = false,
    onToggleCollapsed,
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
            className={`flex h-full min-h-screen shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-base-300 bg-base-100 py-6 transition-[width] duration-300 ease-out ${
                collapsed ? "w-20 gap-4 px-3" : "w-72 gap-6 px-4"
            } ${className}`}
        >
            {/* Logo and collapse toggle */}
            <div
                className={`flex ${
                    collapsed ? "flex-col items-center gap-3" : "items-center gap-2"
                }`}
            >
                {showLogo && (
                    <Link
                        href="/"
                        aria-label="TaskFlow home"
                        className={`flex items-center text-lg font-bold ${
                            collapsed ? "justify-center" : "flex-1 gap-2 px-2"
                        }`}
                    >
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-sm text-primary-content">
                            ✓
                        </span>
                        {!collapsed && <span className="truncate">TaskFlow</span>}
                    </Link>
                )}

                {onToggleCollapsed && (
                    <button
                        type="button"
                        onClick={onToggleCollapsed}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        aria-expanded={!collapsed}
                        /* The sidebar is only docked from the `lg` breakpoint up. */
                        className="btn btn-ghost btn-square btn-sm hidden shrink-0 lg:inline-flex"
                    >
                        {collapsed ? CHEVRON_RIGHT : CHEVRON_LEFT}
                    </button>
                )}
            </div>

            <nav aria-label="Filter todos by status" className="flex-1">
                {!collapsed && (
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-base-content/50">
                        Status
                    </p>
                )}

                <ul
                    className={`mt-2 ${
                        collapsed
                            ? "flex flex-col items-center gap-1"
                            : "space-y-1"
                    }`}
                >
                    {TODO_STATUSES.map((status) => {
                        const isActive = status === currentStatus;
                        const label = STATUS_LABELS[status];
                        const count = counts[status];

                        return (
                            <li key={status}>
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange(status)}
                                    aria-current={isActive ? "page" : undefined}
                                    aria-label={
                                        collapsed
                                            ? `${label}, ${count} ${
                                                  count === 1 ? "task" : "tasks"
                                              }`
                                            : undefined
                                    }
                                    title={collapsed ? `${label} · ${count}` : undefined}
                                    className={
                                        collapsed
                                            ? `relative grid size-9 place-items-center rounded-box transition-colors ${
                                                  isActive
                                                      ? "bg-primary/10 text-primary"
                                                      : "text-base-content/70 hover:bg-base-200"
                                              }`
                                            : `flex w-full items-center gap-3 rounded-box px-3 py-2.5 text-sm transition-colors ${
                                                  isActive
                                                      ? "bg-primary/10 font-semibold text-primary"
                                                      : "text-base-content/80 hover:bg-base-200"
                                              }`
                                    }
                                >
                                    <span
                                        className={
                                            isActive
                                                ? "text-primary"
                                                : STATUS_ICON_COLORS[status]
                                        }
                                    >
                                        {STATUS_ICONS[status]}
                                    </span>

                                    {collapsed ? (
                                        count > 0 && (
                                            <span
                                                aria-hidden
                                                className="absolute right-1 top-1 size-1.5 rounded-full bg-primary"
                                            />
                                        )
                                    ) : (
                                        <>
                                            <span className="flex-1 text-left">
                                                {label}
                                            </span>
                                            <span
                                                className={`badge badge-sm tabular-nums ${
                                                    isActive
                                                        ? "badge-primary"
                                                        : "badge-ghost"
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {children}

            {showProgress &&
                (collapsed ? (
                    <div
                        className="radial-progress self-center text-primary"
                        style={
                            {
                                "--value": progress,
                                "--size": "2.75rem",
                                "--thickness": "3px",
                            } as CSSProperties
                        }
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${progress}% of tasks completed`}
                        title={`${progress}% of all tasks completed`}
                    >
                        <span className="text-[10px] font-bold tabular-nums">
                            {progress}%
                        </span>
                    </div>
                ) : (
                    <section
                        aria-label="Todo progress"
                        className="rounded-box border border-base-300 bg-base-200 p-4"
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
                ))}
        </aside>
    );
};

export default TodoSidebar;
