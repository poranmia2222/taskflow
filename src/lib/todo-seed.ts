/**
 * In-memory seed data for the todo repository.
 *
 * Shape matches the `Todo` model in `src/lib/todos.ts`, which mirrors a future
 * `todos` MongoDB collection, so this file can be deleted once a real database
 * is connected.
 */

import type { Priority, Todo, TodoState } from "@/lib/todos";

type SeedTodo = Omit<Todo, "createdAt" | "updatedAt" | "userId" | "dueDate" | "tags"> &
    Partial<Pick<Todo, "userId" | "dueDate" | "tags" | "description">>;

const USER = "user_demo";

const SEED: SeedTodo[] = [
    {
        id: "1",
        title: "Design the dashboard sidebar",
        description: "Status filters, counts, and a progress summary.",
        status: "in-progress",
        priority: "high",
        project: "Website",
        due: "Today",
        dueDate: "2026-10-20",
        tags: ["design", "ui"],
    },
    {
        id: "2",
        title: "Connect the todo API to the frontend",
        description: "Swap the in-memory repository for real database calls.",
        status: "pending",
        priority: "high",
        project: "Backend",
        due: "Tomorrow",
        dueDate: "2026-10-21",
        tags: ["api"],
    },
    {
        id: "3",
        title: "Write onboarding copy",
        status: "pending",
        priority: "medium",
        project: "Marketing",
        due: "Oct 22",
        dueDate: "2026-10-22",
        tags: ["content"],
    },
    {
        id: "4",
        title: "Review accessibility of the sign-in page",
        status: "in-progress",
        priority: "low",
        project: "Website",
        due: "Oct 24",
        dueDate: "2026-10-24",
        tags: ["a11y"],
    },
    {
        id: "5",
        title: "Set up the staging environment",
        status: "completed",
        priority: "medium",
        project: "DevOps",
        due: "Oct 17",
        dueDate: "2026-10-17",
        tags: ["infra"],
    },
    {
        id: "6",
        title: "Add email and password validation",
        status: "completed",
        priority: "high",
        project: "Backend",
        due: "Oct 15",
        dueDate: "2026-10-15",
        tags: ["auth"],
    },
    {
        id: "7",
        title: "Collect feedback from beta users",
        status: "pending",
        priority: "low",
        project: "Research",
        due: "Oct 28",
        dueDate: "2026-10-28",
        tags: ["research"],
    },
    {
        id: "8",
        title: "Ship the dark theme toggle",
        status: "completed",
        priority: "high",
        project: "Website",
        due: "Oct 19",
        dueDate: "2026-10-19",
        tags: ["ui", "a11y"],
    },
    {
        id: "9",
        title: "Write tests for the repository",
        status: "in-progress",
        priority: "medium",
        project: "Backend",
        due: "Oct 25",
        dueDate: "2026-10-25",
        tags: ["tests"],
    },
    {
        id: "10",
        title: "Draft the Q4 launch announcement",
        status: "pending",
        priority: "high",
        project: "Marketing",
        due: "Oct 23",
        dueDate: "2026-10-23",
        tags: ["content"],
    },
    {
        id: "11",
        title: "Audit bundle size",
        status: "in-progress",
        priority: "low",
        project: "DevOps",
        due: "Oct 27",
        dueDate: "2026-10-27",
        tags: ["infra", "perf"],
    },
    {
        id: "12",
        title: "Plan the customer interview script",
        status: "pending",
        priority: "low",
        project: "Research",
        due: "Oct 30",
        dueDate: "2026-10-30",
        tags: ["research"],
    },
    {
        id: "13",
        title: "Refactor the kanban drag handlers",
        status: "completed",
        priority: "medium",
        project: "Website",
        due: "Oct 16",
        dueDate: "2026-10-16",
        tags: ["refactor"],
    },
    {
        id: "14",
        title: "Set up error monitoring",
        status: "completed",
        priority: "low",
        project: "DevOps",
        due: "Oct 14",
        dueDate: "2026-10-14",
        tags: ["infra"],
    },
];

/** Seed rows, normalised to the full `Todo` shape. */
export const SAMPLE_TODOS: Todo[] = SEED.map((todo, index) => {
    const timestamp = new Date(Date.UTC(2026, 9, 1, 9, index)).toISOString();

    return {
        userId: USER,
        description: "",
        dueDate: null,
        tags: [],
        ...todo,
        createdAt: timestamp,
        updatedAt: timestamp,
    };
});

export const SEED_PRIORITIES: Priority[] = ["low", "medium", "high"];
export const SEED_STATUSES: TodoState[] = ["pending", "in-progress", "completed"];
