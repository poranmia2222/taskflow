"use client";

import { useMemo } from "react";
import BarChart from "@/components/BarChart";
import DonutChart from "@/components/DonutChart";
import { useToday } from "@/lib/clock";
import { useTodos } from "@/hooks/use-todos";
import {
    getCompletionRate,
    getOverdueTodos,
    getPriorityBreakdown,
    getProjectBreakdown,
    getStatusBreakdown,
    getUpcomingTodos,
} from "@/lib/todos";

type StatCardProps = {
    label: string;
    value: string;
    hint?: string;
    token?: string;
};

const StatCard = ({ label, value, hint, token }: StatCardProps) => {
    return (
        <div className="card card-border bg-base-100 shadow-sm">
            <div className="card-body gap-1 p-5">
                <div className="flex items-center gap-2">
                    {token && (
                        <span
                            aria-hidden
                            className="size-2.5 rounded-full"
                            style={{ background: `var(--color-${token})` }}
                        />
                    )}
                    <p className="text-sm text-base-content/60">{label}</p>
                </div>
                <p className="text-3xl font-bold tabular-nums">{value}</p>
                {hint && <p className="text-xs text-base-content/50">{hint}</p>}
            </div>
        </div>
    );
};

const AnalyticsPage = () => {
    const { todos, counts } = useTodos();

    // "Today" only exists on the client. `useToday` renders the server snapshot
    // (`null`) during hydration and re-renders with the real clock afterwards,
    // so the markup can never mismatch.
    const today = useToday();

    const statusData = getStatusBreakdown(todos);
    const priorityData = getPriorityBreakdown(todos);
    const projectData = useMemo(() => getProjectBreakdown(todos), [todos]);

    const total = counts.all;
    const completionRate = getCompletionRate(todos);

    // Deadline lists depend on the current date, so they wait for the client.
    const overdue = useMemo(
        () => (today ? getOverdueTodos(todos, today) : []),
        [todos, today],
    );
    const upcoming = useMemo(
        () => (today ? getUpcomingTodos(todos, 7, today) : []),
        [todos, today],
    );

    const activeProjects = projectData.length;

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
            <header className="mb-8">
                <p className="text-sm font-medium text-primary">Insights</p>
                <h1 className="mt-1 text-3xl font-bold">Analytics</h1>
                <p className="mt-1 text-sm text-base-content/60">
                    How your {total} {total === 1 ? "task" : "tasks"} are distributed right
                    now.
                </p>
            </header>

            {/* Headline numbers */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Total tasks"
                    value={String(total)}
                    hint={`Across ${activeProjects} ${activeProjects === 1 ? "project" : "projects"}`}
                    token="primary"
                />
                <StatCard
                    label="Completion rate"
                    value={`${completionRate}%`}
                    hint={`${counts.completed} of ${total} done`}
                    token="success"
                />
                <StatCard
                    label="In progress"
                    value={String(counts["in-progress"])}
                    hint="Currently being worked on"
                    token="info"
                />
                <StatCard
                    label="Overdue"
                    value={today ? String(overdue.length) : "—"}
                    hint={
                        today
                            ? `${upcoming.length} due in the next 7 days`
                            : "Calculated on load"
                    }
                    token="error"
                />
            </div>

            {/* Progress bar */}
            <section className="card card-border mb-6 bg-base-100 shadow-sm">
                <div className="card-body gap-3 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h2 className="font-semibold">Overall progress</h2>
                        <span className="text-sm text-base-content/60 tabular-nums">
                            {counts.completed}/{total} tasks completed
                        </span>
                    </div>
                    <progress
                        className="progress progress-primary w-full"
                        value={completionRate}
                        max={100}
                        aria-label={`${completionRate}% of tasks completed`}
                    />
                </div>
            </section>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-3">
                <section className="card card-border bg-base-100 shadow-sm">
                    <div className="card-body gap-5 p-5">
                        <h2 className="font-semibold">By status</h2>
                        <DonutChart
                            data={statusData}
                            centerLabel={`${completionRate}%`}
                            centerCaption="complete"
                        />
                    </div>
                </section>

                <section className="card card-border bg-base-100 shadow-sm">
                    <div className="card-body gap-5 p-5">
                        <h2 className="font-semibold">By priority</h2>
                        <BarChart data={priorityData} />
                    </div>
                </section>

                <section className="card card-border bg-base-100 shadow-sm">
                    <div className="card-body gap-5 p-5">
                        <h2 className="font-semibold">By project</h2>
                        <BarChart data={projectData} />
                    </div>
                </section>
            </div>

            {/* Deadlines */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <section className="card card-border bg-base-100 shadow-sm">
                    <div className="card-body gap-4 p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="font-semibold">Needs attention</h2>
                            <span className="badge badge-error badge-soft badge-sm tabular-nums">
                                {overdue.length} overdue
                            </span>
                        </div>

                        {overdue.length === 0 ? (                            <p className="py-6 text-center text-sm text-base-content/50">
                                Nothing overdue. Nice work.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {overdue.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className="flex items-center gap-3 rounded-box bg-base-200/60 px-3 py-2"
                                    >
                                        <span
                                            aria-hidden
                                            className="size-2 shrink-0 rounded-full"
                                            style={{
                                                background: `var(--color-${todo.priority === "high" ? "error" : todo.priority === "medium" ? "warning" : "success"})`,
                                            }}
                                        />
                                        <span className="min-w-0 flex-1 truncate text-sm">
                                            {todo.title}
                                        </span>
                                        <span className="shrink-0 text-xs text-error">
                                            {todo.due}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>

                <section className="card card-border bg-base-100 shadow-sm">
                    <div className="card-body gap-4 p-5">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="font-semibold">Due this week</h2>
                            <span className="badge badge-ghost badge-sm tabular-nums">
                                {upcoming.length} tasks
                            </span>
                        </div>

                        {upcoming.length === 0 ? (
                            <p className="py-6 text-center text-sm text-base-content/50">
                                Nothing due in the next seven days.
                            </p>
                        ) : (
                            <ul className="space-y-2">
                                {upcoming.map((todo) => (
                                    <li
                                        key={todo.id}
                                        className="flex items-center gap-3 rounded-box bg-base-200/60 px-3 py-2"
                                    >
                                        <span className="min-w-0 flex-1 truncate text-sm">
                                            {todo.title}
                                        </span>
                                        <span className="shrink-0 text-xs text-base-content/60">
                                            {todo.due}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AnalyticsPage;
