/**
 * Todo repository.
 *
 * Today it is backed by an in-memory array. When MongoDB is wired up, keep the
 * exact same function signatures and replace the bodies with collection calls —
 * nothing in the UI needs to change.
 *
 * Example Mongo implementation:
 *
 *   const todos = db.collection<TodoDocument>("todos");
 *   export async function listTodos(userId: string) {
 *     return (await todos.find({ userId }).sort({ createdAt: -1 }).toArray())
 *       .map(toTodo);
 *   }
 */

import {
    filterTodos,
    type NewTodo,
    type Todo,
    type TodoFilters,
    type TodoPatch,
    type TodoState,
} from "@/lib/todos";
import { SAMPLE_TODOS } from "@/lib/todo-seed";

function sortTodos(todos: Todo[]): Todo[] {
    return [...todos].sort((a, b) => {
        // Soonest due date first, tasks without a date last.
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return a.createdAt.localeCompare(b.createdAt);
    });
}

function createId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `todo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export class TodoRepository {
    private todos: Todo[];

    constructor(initial: Todo[] = SAMPLE_TODOS) {
        this.todos = initial.map((todo) => ({ ...todo }));
    }

    /** All tasks, optionally filtered by status and the filter bar. */
    list(options: { status?: TodoState | "all"; filters?: TodoFilters } = {}): Todo[] {
        const { status = "all", filters } = options;
        return sortTodos(filterTodos(this.todos, status, filters));
    }

    /** A single task, or `undefined`. */
    find(id: string): Todo | undefined {
        return this.todos.find((todo) => todo.id === id);
    }

    /** Creates a task and returns the stored row. */
    create(input: NewTodo): Todo {
        const now = new Date().toISOString();

        const todo: Todo = {
            id: createId(),
            userId: input.userId ?? "",
            title: input.title.trim(),
            description: input.description ?? "",
            status: input.status ?? "pending",
            priority: input.priority ?? "medium",
            project: input.project ?? "Inbox",
            due: input.due ?? "No date",
            dueDate: input.dueDate ?? null,
            tags: input.tags ?? [],
            createdAt: now,
            updatedAt: now,
        };

        this.todos = [todo, ...this.todos];
        return todo;
    }

    /** Merges a patch into a task and returns the updated row. */
    update(id: string, patch: TodoPatch): Todo | undefined {
        let updated: Todo | undefined;

        this.todos = this.todos.map((todo) => {
            if (todo.id !== id) return todo;

            updated = {
                ...todo,
                ...patch,
                title: patch.title?.trim() ?? todo.title,
                updatedAt: new Date().toISOString(),
            };

            return updated;
        });

        return updated;
    }

    /** Convenience wrapper used by drag-and-drop. */
    move(id: string, status: TodoState): Todo | undefined {
        return this.update(id, { status });
    }

    /** Deletes a task. Returns whether a row was removed. */
    remove(id: string): boolean {
        const before = this.todos.length;
        this.todos = this.todos.filter((todo) => todo.id !== id);
        return this.todos.length !== before;
    }

    /** Replaces all rows. Handy for tests and for syncing a server response. */
    replaceAll(todos: Todo[]): void {
        this.todos = todos.map((todo) => ({ ...todo }));
    }

    /** Current snapshot. */
    all(): Todo[] {
        return this.todos.map((todo) => ({ ...todo }));
    }
}

export const todoRepository = new TodoRepository();
