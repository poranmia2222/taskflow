"use client";

import { useRef, useState } from "react";
import TodoCard from "@/components/TodoCard";
import { gsap, useGSAP } from "@/lib/gsap";
import { BOARD_COLUMNS, STATUS_LABELS, type Todo, type TodoState } from "@/lib/todos";

const COLUMN_ACCENTS: Record<TodoState, string> = {
    pending: "border-t-warning",
    "in-progress": "border-t-info",
    completed: "border-t-success",
};

const COLUMN_DOT: Record<TodoState, string> = {
    pending: "bg-warning",
    "in-progress": "bg-info",
    completed: "bg-success",
};

type KanbanBoardProps = {
    /** Tasks to render. Filtering happens upstream so counts stay in sync. */
    todos: Todo[];
    /** Called when a card is dropped into a different column. */
    onStatusChange?: (id: string, status: TodoState) => void;
    /** Called when a card's delete button is pressed. */
    onRemove?: (id: string) => void;
    /** Columns to render. Defaults to all board columns. */
    columns?: TodoState[];
    className?: string;
};

const KanbanBoard = ({
    todos,
    onStatusChange,
    onRemove,
    columns = BOARD_COLUMNS,
    className = "",
}: KanbanBoardProps) => {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [overColumn, setOverColumn] = useState<TodoState | null>(null);
    const board = useRef<HTMLDivElement>(null);

    // The columns slide in one after another the first time the board shows.
    useGSAP(
        () => {
            const media = gsap.matchMedia();

            media.add("(prefers-reduced-motion: no-preference)", () => {
                if (!board.current) return;

                gsap.from(board.current.children, {
                    autoAlpha: 0,
                    y: 16,
                    duration: 0.45,
                    stagger: 0.08,
                    ease: "power3.out",
                    // Drop the inline styles afterwards so dragging a card is
                    // not fighting with a leftover transform.
                    clearProps: "transform,opacity,visibility",
                });
            });
        },
        { scope: board },
    );

    const handleDragStart = (event: React.DragEvent<HTMLElement>, id: string) => {
        setDraggingId(id);
        event.dataTransfer.effectAllowed = "move";
        // Some browsers require data to be set for a drag to start.
        event.dataTransfer.setData("text/plain", id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setOverColumn(null);
    };

    const handleDrop = (event: React.DragEvent<HTMLElement>, status: TodoState) => {
        event.preventDefault();
        const id = draggingId ?? event.dataTransfer.getData("text/plain");
        setDraggingId(null);
        setOverColumn(null);

        if (!id) return;

        const todo = todos.find((item) => item.id === id);
        if (!todo || todo.status === status) return;

        onStatusChange?.(id, status);
    };

    // Three columns only once the board has room for them; the right panel
    // takes up space on wide screens.
    const gridClass = columns.length === 1 ? "grid-cols-1" : "md:grid-cols-2 2xl:grid-cols-3";

    return (
        <div ref={board} className={`grid gap-4 ${gridClass} ${className}`}>
            {columns.map((status) => {
                const columnTodos = todos.filter((todo) => todo.status === status);
                const isOver = overColumn === status;

                return (
                    <section
                        key={status}
                        aria-label={STATUS_LABELS[status]}
                        onDragOver={(event) => {
                            event.preventDefault();
                            event.dataTransfer.dropEffect = "move";
                            setOverColumn(status);
                        }}
                        onDragLeave={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                                setOverColumn((current) =>
                                    current === status ? null : current,
                                );
                            }
                        }}
                        onDrop={(event) => handleDrop(event, status)}
                        className={`flex min-h-64 flex-col gap-3 rounded-box border border-t-4 border-base-300 bg-base-200 p-3 transition-colors ${COLUMN_ACCENTS[status]} ${
                            isOver ? "border-primary bg-primary/10" : ""
                        }`}
                    >
                        <header className="flex items-center gap-2 px-1">
                            <span
                                aria-hidden
                                className={`size-2.5 rounded-full ${COLUMN_DOT[status]}`}
                            />
                            <h2 className="text-sm font-semibold">
                                {STATUS_LABELS[status]}
                            </h2>
                            <span className="badge badge-ghost badge-sm ml-auto tabular-nums">
                                {columnTodos.length}
                            </span>
                        </header>

                        <div className="flex flex-1 flex-col gap-3">
                            {columnTodos.length === 0 ? (
                                <p className="grid flex-1 place-items-center rounded-box border border-dashed border-base-300 p-6 text-center text-xs text-base-content/50">
                                    Drop a task here
                                </p>
                            ) : (
                                columnTodos.map((todo) => (
                                    <TodoCard
                                        key={todo.id}
                                        todo={todo}
                                        draggable
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                        onRemove={onRemove}
                                        className={
                                            draggingId === todo.id ? "opacity-50" : ""
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
};

export default KanbanBoard;
