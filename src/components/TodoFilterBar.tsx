"use client";

import { PRIORITIES, type Priority, type TodoFilters } from "@/lib/todos";

type TodoFilterBarProps = {
    filters: TodoFilters;
    onChange: <K extends keyof TodoFilters>(key: K, value: TodoFilters[K]) => void;
    onReset: () => void;
    projects: string[];
    tags: string[];
    assignees: string[];
    /** Number of tasks currently matching the filters. */
    resultCount: number;
    isFiltering: boolean;
    className?: string;
};

const ALL = "all";

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

const TodoFilterBar = ({
    filters,
    onChange,
    onReset,
    projects,
    tags,
    assignees,
    resultCount,
    isFiltering,
    className = "",
}: TodoFilterBarProps) => {
    return (
        <div
            role="search"
            className={`flex flex-wrap items-center gap-2 rounded-box border border-base-300 bg-base-100 p-3 ${className}`}
        >
            {/* Search */}
            <label className="input input-sm input-bordered flex flex-1 basis-56 items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-base-content/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    aria-hidden
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
                    />
                </svg>
                <input
                    type="search"
                    value={filters.search ?? ""}
                    onChange={(event) => onChange("search", event.target.value)}
                    placeholder="Search tasks, projects, tags…"
                    className="grow"
                    aria-label="Search tasks"
                />
            </label>

            {/* Priority */}
            <select
                value={filters.priority ?? ALL}
                onChange={(event) =>
                    onChange("priority", event.target.value as Priority | "all")
                }
                className="select select-sm select-bordered w-36"
                aria-label="Filter by priority"
            >
                <option value={ALL}>Any priority</option>
                {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                        {capitalize(priority)}
                    </option>
                ))}
            </select>

            {/* Project */}
            <select
                value={filters.project ?? ALL}
                onChange={(event) => onChange("project", event.target.value)}
                className="select select-sm select-bordered w-36"
                aria-label="Filter by project"
            >
                <option value={ALL}>Any project</option>
                {projects.map((project) => (
                    <option key={project} value={project}>
                        {project}
                    </option>
                ))}
            </select>

            {/* Assignee */}
            <select
                value={filters.assignee ?? ALL}
                onChange={(event) => onChange("assignee", event.target.value)}
                className="select select-sm select-bordered w-36"
                aria-label="Filter by assignee"
            >
                <option value={ALL}>Anyone</option>
                <option value="unassigned">Unassigned</option>
                {assignees.map((assignee) => (
                    <option key={assignee} value={assignee}>
                        {assignee}
                    </option>
                ))}
            </select>

            {/* Tag */}
            {tags.length > 0 && (
                <select
                    value={filters.tag ?? ALL}
                    onChange={(event) => onChange("tag", event.target.value)}
                    className="select select-sm select-bordered w-32"
                    aria-label="Filter by tag"
                >
                    <option value={ALL}>Any tag</option>
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>
                            #{tag}
                        </option>
                    ))}
                </select>
            )}

            <div className="ml-auto flex items-center gap-3">
                <span className="text-xs text-base-content/60 tabular-nums">
                    {resultCount} {resultCount === 1 ? "match" : "matches"}
                </span>

                <button
                    type="button"
                    onClick={onReset}
                    disabled={!isFiltering}
                    className="btn btn-ghost btn-sm"
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default TodoFilterBar;
