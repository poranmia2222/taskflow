import type { Priority, Todo } from "@/lib/todos";

export const PRIORITY_STYLES: Record<Priority, string> = {
    high: "badge-error badge-soft",
    medium: "badge-warning badge-soft",
    low: "badge-success badge-soft",
};

export type TodoCardProps = {
    todo: Todo;
    /** Enables the completion checkbox. */
    onToggle?: (id: string) => void;
    /** When true the card becomes draggable. */
    draggable?: boolean;
    onDragStart?: (event: React.DragEvent<HTMLElement>, id: string) => void;
    onDragEnd?: (event: React.DragEvent<HTMLElement>) => void;
    onRemove?: (id: string) => void;
    className?: string;
};

const DragHandleIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
    >
        <circle cx="9" cy="6" r="1.5" />
        <circle cx="15" cy="6" r="1.5" />
        <circle cx="9" cy="12" r="1.5" />
        <circle cx="15" cy="12" r="1.5" />
        <circle cx="9" cy="18" r="1.5" />
        <circle cx="15" cy="18" r="1.5" />
    </svg>
);

const TodoCard = ({
    todo,
    onToggle,
    draggable = false,
    onDragStart,
    onDragEnd,
    onRemove,
    className = "",
}: TodoCardProps) => {
    const isDone = todo.status === "completed";

    return (
        <article
            draggable={draggable}
            onDragStart={(event) => onDragStart?.(event, todo.id)}
            onDragEnd={onDragEnd}
            className={`card rounded-box border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-xl ${
                draggable ? "cursor-grab active:cursor-grabbing" : ""
            } ${className}`}
        >
            <div className="flex items-start gap-3 p-4">
                {draggable ? (
                    <span className="mt-0.5 shrink-0 text-base-content/30" aria-hidden>
                        {DragHandleIcon}
                    </span>
                ) : (
                    onToggle && (
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary mt-0.5"
                            checked={isDone}
                            onChange={() => onToggle(todo.id)}
                            aria-label={`Mark "${todo.title}" as ${
                                isDone ? "incomplete" : "complete"
                            }`}
                        />
                    )
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className={`text-sm font-medium ${
                                isDone ? "text-base-content/50 line-through" : ""
                            }`}
                        >
                            {todo.title}
                        </h3>

                        {onRemove && (
                            <button
                                type="button"
                                onClick={() => onRemove(todo.id)}
                                aria-label={`Delete "${todo.title}"`}
                                className="btn btn-ghost btn-xs text-base-content/40 hover:text-error"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {todo.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-base-content/60">
                            {todo.description}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                            className={`badge badge-sm capitalize ${PRIORITY_STYLES[todo.priority]}`}
                        >
                            {todo.priority}
                        </span>
                        <span className="text-xs text-base-content/60">Due {todo.due}</span>
                        <span aria-hidden className="text-base-content/30">
                            ·
                        </span>
                        <span className="text-xs text-base-content/60">{todo.project}</span>
                    </div>

                    {todo.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {todo.tags.map((tag) => (
                                <span key={tag} className="badge badge-ghost badge-xs">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};

export default TodoCard;
