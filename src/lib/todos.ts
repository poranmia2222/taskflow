/**
 * Todo domain model.
 *
 * This file is deliberately the *only* place that knows the shape of a task, so
 * swapping the in-memory store for MongoDB later means changing this file and
 * nothing in the UI.
 *
 * Mongo mapping notes:
 * - `id`    -> maps to the document `_id` (as a string).
 * - `dueDate` is an ISO `YYYY-MM-DD` string. Store as a `Date` in Mongo and
 *   convert at the repository boundary.
 * - `createdAt` / `updatedAt` are ISO timestamps.
 * - `userId` is the owner, ready for `{ userId: 1, status: 1 }` indexing.
 */

export const TODO_STATUSES = ["all", "pending", "in-progress", "completed"] as const;

export type TodoStatus = (typeof TODO_STATUSES)[number];
export type TodoState = Exclude<TodoStatus, "all">;

/** Columns of the kanban board, in display order. */
export const BOARD_COLUMNS: TodoState[] = ["pending", "in-progress", "completed"];

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

/** Fallback project used when a task is created without one. */
export const INBOX_PROJECT = "Inbox";

export type Todo = {
    id: string;
    /** Owner. Empty string means "unassigned" until auth is wired up. */
    userId: string;
    title: string;
    description?: string;
    status: TodoState;
    priority: Priority;
    /** Grouping label, e.g. "Backend". */
    project: string;
    /** Short human label such as "Today" or "Oct 22". */
    due: string;
    /** `YYYY-MM-DD`, or null when there is no deadline. */
    dueDate: string | null;
    tags: string[];
    /** ISO timestamp. */
    createdAt: string;
    /** ISO timestamp. */
    updatedAt: string;
};

/** Fields a client is allowed to send when creating a task. */
export type NewTodo = Pick<Todo, "title"> &
    Partial<
        Pick<
            Todo,
            | "userId"
            | "description"
            | "status"
            | "priority"
            | "project"
            | "due"
            | "dueDate"
            | "tags"
        >
    >;

/** Fields a client is allowed to patch on an existing task. */
export type TodoPatch = Partial<NewTodo>;

export const STATUS_LABELS: Record<TodoStatus, string> = {
    all: "All tasks",
    pending: "To do",
    "in-progress": "In progress",
    completed: "Completed",
};

/** Filters applied on top of the status filter, mirroring a query string. */
export type TodoFilters = {
    /** Free-text search across title, description, project, and tags. */
    search?: string;
    priority?: Priority | "all";
    /** `"all"` or a project name. */
    project?: string;
    /** `"all"` or a user id; `"unassigned"` matches tasks with no owner. */
    assignee?: string;
    /** `"all"` or a tag. */
    tag?: string;
};

export const EMPTY_FILTERS: TodoFilters = {
    search: "",
    priority: "all",
    project: "all",
    assignee: "all",
    tag: "all",
};

export function isTodoState(value: string): value is TodoState {
    return (BOARD_COLUMNS as string[]).includes(value);
}

/** Matches a task against a status plus the active filter bar. */
export function filterTodos(
    todos: Todo[],
    status: TodoStatus,
    filters: TodoFilters = EMPTY_FILTERS,
): Todo[] {
    const search = filters.search?.trim().toLowerCase() ?? "";

    return todos.filter((todo) => {
        if (status !== "all" && todo.status !== status) return false;

        if (filters.priority && filters.priority !== "all" && todo.priority !== filters.priority) {
            return false;
        }

        if (filters.project && filters.project !== "all" && todo.project !== filters.project) {
            return false;
        }

        if (filters.tag && filters.tag !== "all" && !todo.tags.includes(filters.tag)) {
            return false;
        }

        if (filters.assignee && filters.assignee !== "all") {
            if (filters.assignee === "unassigned") {
                if (todo.userId) return false;
            } else if (todo.userId !== filters.assignee) {
                return false;
            }
        }

        if (search) {
            const haystack = [
                todo.title,
                todo.description ?? "",
                todo.project,
                ...todo.tags,
            ]
                .join(" ")
                .toLowerCase();

            if (!haystack.includes(search)) return false;
        }

        return true;
    });
}

/** Counts for the sidebar. */
export function getTodoCounts(todos: Todo[]): Record<TodoStatus, number> {
    return {
        all: todos.length,
        pending: todos.filter((todo) => todo.status === "pending").length,
        "in-progress": todos.filter((todo) => todo.status === "in-progress").length,
        completed: todos.filter((todo) => todo.status === "completed").length,
    };
}

/** Distinct project names, sorted, for the filter bar. */
export function getProjects(todos: Todo[]): string[] {
    return [...new Set(todos.map((todo) => todo.project))].sort();
}

/** Distinct tags, sorted, for the filter bar. */
export function getTags(todos: Todo[]): string[] {
    return [...new Set(todos.flatMap((todo) => todo.tags))].sort();
}

export function getAssignees(todos: Todo[]): string[] {
    return [...new Set(todos.map((todo) => todo.userId).filter(Boolean))].sort();
}
