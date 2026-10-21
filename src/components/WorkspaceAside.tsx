"use client";

import { useMemo, useState } from "react";
import FocusTimer from "@/components/FocusTimer";
import MiniCalendar from "@/components/MiniCalendar";
import UpcomingTasks from "@/components/UpcomingTasks";
import { useToday } from "@/lib/clock";
import { toDateKey } from "@/lib/dates";
import { getOverdueTodos, type Todo, type TodoState } from "@/lib/todos";

type WorkspaceAsideProps = {
    /** Every task in the workspace. */
    todos: Todo[];
    /** Marks a task as done. */
    onToggle: (id: string) => void;
    /** Moves a task to another status. */
    onMove: (id: string, status: TodoState) => void;
    className?: string;
};

/**
 * The right-hand panel of the workspace: a calendar, a focus timer, and the
 * tasks that are coming up.
 *
 * The calendar and the task list share the selected day, so picking a date in
 * the calendar narrows the list down to that day.
 */
const WorkspaceAside = ({
    todos,
    onToggle,
    onMove,
    className = "",
}: WorkspaceAsideProps) => {
    const today = useToday();
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [focusTaskId, setFocusTaskId] = useState<string | null>(null);

    /** The task the timer is focused on. */
    const focusTask = useMemo(
        () => todos.find((todo) => todo.id === focusTaskId) ?? null,
        [todos, focusTaskId],
    );

    const overdueCount = useMemo(
        () => (today ? getOverdueTodos(todos, today).length : 0),
        [todos, today],
    );

    const dueTodayCount = useMemo(() => {
        if (!today) return 0;
        const key = toDateKey(today);

        return todos.filter(
            (todo) => todo.dueDate === key && todo.status !== "completed",
        ).length;
    }, [todos, today]);

    return (
        <div className={`flex flex-col gap-4 p-4 ${className}`}>
            {/* Today at a glance */}
            <section className="rounded-box border border-base-200 bg-base-200/40 p-4">
                <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-sm font-semibold">Today</h2>
                    <span className="text-xs text-base-content/60">
                        {today
                            ? today.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                              })
                            : "—"}
                    </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-box bg-base-100 p-2 text-center">
                        <p className="text-lg font-bold tabular-nums">
                            {dueTodayCount}
                        </p>
                        <p className="text-[11px] text-base-content/60">Due today</p>
                    </div>
                    <div className="rounded-box bg-base-100 p-2 text-center">
                        <p className="text-lg font-bold tabular-nums text-error">
                            {overdueCount}
                        </p>
                        <p className="text-[11px] text-base-content/60">Overdue</p>
                    </div>
                </div>
            </section>

            {today ? (
                <>
                    <MiniCalendar
                        todos={todos}
                        today={today}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />

                    <FocusTimer task={focusTask} />

                    <UpcomingTasks
                        todos={todos}
                        today={today}
                        selectedDate={selectedDate}
                        onClearSelection={() => setSelectedDate(null)}
                        focusTaskId={focusTaskId}
                        onFocusTask={setFocusTaskId}
                        onToggle={onToggle}
                        onMove={onMove}
                    />
                </>
            ) : (
                // The clock is only known on the client, so the panel waits for it.
                <div className="skeleton h-72 w-full rounded-box" />
            )}
        </div>
    );
};

export default WorkspaceAside;
