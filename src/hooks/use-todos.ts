"use client";

import { useMemo, useState } from "react";
import { todoRepository } from "@/lib/todo-repository";
import {
    EMPTY_FILTERS,
    filterTodos,
    getAssignees,
    getProjects,
    getTags,
    getTodoCounts,
    type NewTodo,
    type Todo,
    type TodoFilters,
    type TodoPatch,
    type TodoState,
    type TodoStatus,
} from "@/lib/todos";

/**
 * Single entry point the UI uses to read and write tasks.
 *
 * The repository owns the data; this hook owns the React state and hands the
 * components plain arrays. When the repository becomes async (database), only
 * this file changes: swap the direct calls for awaited ones and keep the same
 * return shape.
 */
export function useTodos(initialStatus: TodoStatus = "all") {
    const [todos, setTodos] = useState<Todo[]>(() => todoRepository.all());
    const [status, setStatus] = useState<TodoStatus>(initialStatus);
    const [filters, setFilters] = useState<TodoFilters>(EMPTY_FILTERS);

    const sync = () => setTodos(todoRepository.all());

    const counts = useMemo(() => getTodoCounts(todos), [todos]);

    /** Tasks matching the sidebar status plus the filter bar. */
    const visibleTodos = useMemo(
        () => filterTodos(todos, status, filters),
        [todos, status, filters],
    );

    /** Counts for the status sidebar, also respecting the filter bar. */
    const filteredCounts = useMemo(() => {
        const matchesFilters = filterTodos(todos, "all", filters);
        return getTodoCounts(matchesFilters);
    }, [todos, filters]);

    const projects = useMemo(() => getProjects(todos), [todos]);
    const tags = useMemo(() => getTags(todos), [todos]);
    const assignees = useMemo(() => getAssignees(todos), [todos]);

    const isFiltering =
        (filters.search?.trim() ?? "") !== "" ||
        filters.priority !== "all" ||
        filters.project !== "all" ||
        filters.assignee !== "all" ||
        filters.tag !== "all";

    const updateFilter = <K extends keyof TodoFilters>(key: K, value: TodoFilters[K]) => {
        setFilters((current) => ({ ...current, [key]: value }));
    };

    const resetFilters = () => setFilters(EMPTY_FILTERS);

    const addTodo = (input: NewTodo) => {
        todoRepository.create(input);
        sync();
    };

    /** Toggles a task between pending and completed. */
    const toggleTodo = (id: string) => {
        const todo = todoRepository.find(id);
        if (!todo) return;
        todoRepository.update(id, {
            status: todo.status === "completed" ? "pending" : "completed",
        });
        sync();
    };

    const moveTodo = (id: string, next: TodoState) => {
        todoRepository.move(id, next);
        sync();
    };

    const updateTodo = (id: string, patch: TodoPatch) => {
        todoRepository.update(id, patch);
        sync();
    };

    const removeTodo = (id: string) => {
        todoRepository.remove(id);
        sync();
    };

    return {
        /** Every task, unfiltered. */
        todos,
        /** Tasks matching the active status and filters. */
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
        updateTodo,
        removeTodo,
    };
}

export type UseTodosResult = ReturnType<typeof useTodos>;
