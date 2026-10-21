"use client";

import { useEffect, useState } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import TaskFormModal from "@/components/TaskFormModal";
import TodoFilterBar from "@/components/TodoFilterBar";
import TodoSidebar from "@/components/TodoSidebar";
import WorkspaceAside from "@/components/WorkspaceAside";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTodos } from "@/hooks/use-todos";
import {
    BOARD_COLUMNS,
    STATUS_LABELS,
    TODO_STATUSES,
    type Todo,
    type TodoState,
} from "@/lib/todos";

type TodoWorkspaceProps = {
    /** Seed rows. The hook owns the live data after mount. */
    initialTodos?: Todo[];
    className?: string;
};

const TodoWorkspace = ({ className = "" }: TodoWorkspaceProps) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isAsideOpen, setAsideOpen] = useState(false);

    /** The right panel is docked next to the board on wide screens. */
    const isWide = useMediaQuery("(min-width: 1280px)");

    const {
        todos,
        visibleTodos,
        counts,
        filteredCounts,
        projects,
        tags,
        assignees,
        status,
        setStatus,
        filters,
        updateFilter,
        resetFilters,
        isFiltering,
        addTodo,
        toggleTodo,
        moveTodo,
        removeTodo,
    } = useTodos();

    // Escape closes the slide-over panel on small screens.
    useEffect(() => {
        if (!isAsideOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setAsideOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isAsideOpen]);

    /* "All tasks" shows every column; a single status narrows the board to it. */
    const columns: TodoState[] = status === "all" ? BOARD_COLUMNS : [status];

    const completed = counts.completed;
    const total = counts.all;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className={`drawer lg:drawer-open ${className}`}>
            <input
                id="todo-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={drawerOpen}
                onChange={(event) => setDrawerOpen(event.target.checked)}
            />

            <div className="drawer-content flex min-h-full flex-col bg-base-200/40 xl:flex-row">
                <div className="flex min-w-0 flex-1 flex-col">
                    {/* Mobile header */}
                    <header className="flex items-center gap-3 border-b border-base-200 bg-base-100 px-4 py-3 lg:hidden">
                        <label
                            htmlFor="todo-drawer"
                            className="btn btn-ghost btn-square"
                            aria-label="Open status menu"
                        >
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
                                    d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                                />
                            </svg>
                        </label>
                        <span className="flex items-center gap-2 font-bold">
                            <span className="grid size-7 place-items-center rounded-lg bg-primary text-xs text-primary-content">
                                ✓
                            </span>
                            TaskFlow
                        </span>
                    </header>

                    <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">
                        <div className="mx-auto max-w-6xl">
                            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-primary">
                                        My workspace
                                    </p>
                                    <h1 className="mt-1 text-3xl font-bold">
                                        {STATUS_LABELS[status]}
                                    </h1>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        {visibleTodos.length}{" "}
                                        {visibleTodos.length === 1 ? "task" : "tasks"}
                                        {status === "all" &&
                                            ` · ${completed} completed · ${progress}% done`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setAsideOpen(true)}
                                        aria-controls="workspace-aside"
                                        aria-expanded={isAsideOpen}
                                        className="btn btn-outline btn-sm shrink-0 xl:hidden"
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
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5A2.25 2.25 0 0 1 5.25 5.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                                            />
                                        </svg>
                                        Panel
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setCreateOpen(true)}
                                        className="btn btn-primary btn-sm shrink-0"
                                    >
                                        + New task
                                    </button>
                                </div>
                            </header>

                            <TodoFilterBar
                                filters={filters}
                                onChange={updateFilter}
                                onReset={resetFilters}
                                projects={projects}
                                tags={tags}
                                assignees={assignees}
                                resultCount={visibleTodos.length}
                                isFiltering={isFiltering}
                                className="mb-6"
                            />

                            {/* Mobile status filters */}
                            <div
                                role="group"
                                aria-label="Filter todos by status"
                                className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden"
                            >
                                {TODO_STATUSES.map((next) => {
                                    const isActive = next === status;

                                    return (
                                        <button
                                            key={next}
                                            type="button"
                                            onClick={() => setStatus(next)}
                                            aria-pressed={isActive}
                                            className={`btn btn-sm shrink-0 ${
                                                isActive ? "btn-primary" : "btn-ghost bg-base-100"
                                            }`}
                                        >
                                            {STATUS_LABELS[next]}
                                            <span
                                                className={`badge badge-sm tabular-nums ${
                                                    isActive
                                                        ? "border-0 bg-primary-content/20 text-primary-content"
                                                        : "badge-ghost"
                                                }`}
                                            >
                                                {filteredCounts[next]}
                                            </span>
                                        </button>
                                    );
                                })}

                                <span className="ml-auto shrink-0 text-xs text-base-content/60 tabular-nums">
                                    {completed}/{total} done
                                </span>
                            </div>

                            {visibleTodos.length === 0 ? (
                                <div className="rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
                                    <div className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-base-200 text-lg">
                                        ✓
                                    </div>
                                    <h2 className="font-semibold">Nothing here</h2>
                                    <p className="mt-1 text-sm text-base-content/60">
                                        {isFiltering
                                            ? "No tasks match the current filters."
                                            : "No tasks in this status yet."}
                                    </p>
                                    {isFiltering && (
                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="btn btn-outline btn-sm mt-4"
                                        >
                                            Clear filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <KanbanBoard
                                    todos={visibleTodos}
                                    columns={columns}
                                    onStatusChange={moveTodo}
                                    onRemove={removeTodo}
                                />
                            )}

                            <p className="mt-6 text-center text-xs text-base-content/50">
                                Drag a card between columns to update its status. Everything
                                updates live — the sidebar counts included.
                            </p>
                        </div>
                    </main>
                </div>

                {/* Backdrop for the slide-over panel on small screens */}
                {isAsideOpen && (
                    <button
                        type="button"
                        aria-label="Close panel"
                        onClick={() => setAsideOpen(false)}
                        className="fixed inset-0 z-30 bg-black/40 xl:hidden"
                    />
                )}

                <aside
                    id="workspace-aside"
                    aria-label="Calendar, focus timer, and upcoming tasks"
                    inert={!isWide && !isAsideOpen}
                    className={`fixed inset-y-0 right-0 z-40 w-80 shrink-0 overflow-y-auto border-l border-base-200 bg-base-100 transition-transform xl:sticky xl:top-16 xl:bottom-auto xl:z-auto xl:h-[calc(100dvh-4rem)] xl:translate-x-0 ${
                        isAsideOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                >
                    <WorkspaceAside
                        todos={todos}
                        onToggle={toggleTodo}
                        onMove={moveTodo}
                    />
                </aside>
            </div>

            <div className="drawer-side z-40">
                <label
                    htmlFor="todo-drawer"
                    aria-label="Close status menu"
                    className="drawer-overlay"
                />
                <TodoSidebar
                    todos={todos}
                    activeStatus={status}
                    onStatusChange={(next) => {
                        setStatus(next);
                        setDrawerOpen(false);
                    }}
                    className="min-h-0"
                />
            </div>

            <TaskFormModal
                open={isCreateOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={addTodo}
                projects={projects}
                tags={tags}
            />
        </div>
    );
};

export default TodoWorkspace;
