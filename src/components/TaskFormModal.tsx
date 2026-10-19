"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import {
    BOARD_COLUMNS,
    INBOX_PROJECT,
    PRIORITIES,
    STATUS_LABELS,
    type NewTodo,
    type Priority,
    type TodoState,
} from "@/lib/todos";

type TaskFormModalProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: (todo: NewTodo) => void;
    /** Existing project names, offered as suggestions alongside a free-text field. */
    projects?: string[];
    /** Existing tags, offered as quick-add chips. */
    tags?: string[];
};

type FormState = {
    title: string;
    description: string;
    status: TodoState;
    priority: Priority;
    project: string;
    due: string;
    dueDate: string;
    tags: string[];
};

const EMPTY_FORM: FormState = {
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    project: "",
    due: "",
    dueDate: "",
    tags: [],
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Turns `2026-10-22` into `Oct 22` so the card shows a short label. */
function formatDueLabel(dueDate: string): string {
    if (!dueDate) return "No date";

    const parsed = new Date(`${dueDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return dueDate;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = Math.round(
        (parsed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";

    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const TaskFormModal = ({
    open,
    onClose,
    onSubmit,
    projects = [],
    tags = [],
}: TaskFormModalProps) => {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [tagDraft, setTagDraft] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Reset the form whenever the modal transitions from closed to open.
    // Deriving during render avoids a cascading render inside an effect.
    const [wasOpen, setWasOpen] = useState(open);
    if (open !== wasOpen) {
        setWasOpen(open);
        if (open) {
            setForm(EMPTY_FORM);
            setTagDraft("");
            setError(null);
        }
    }

    const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const addTag = (raw: string) => {
        const tag = raw.trim().replace(/^#/, "").toLowerCase();
        if (!tag || form.tags.includes(tag)) {
            setTagDraft("");
            return;
        }

        setField("tags", [...form.tags, tag]);
        setTagDraft("");
    };

    const removeTag = (tag: string) => {
        setField(
            "tags",
            form.tags.filter((current) => current !== tag),
        );
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const title = form.title.trim();
        if (!title) {
            setError("Give the task a title.");
            return;
        }

        const project = form.project.trim() || projects[0] || INBOX_PROJECT;

        // Pending tags typed but not yet committed should still be saved.
        const pendingTag = tagDraft.trim().replace(/^#/, "").toLowerCase();
        const allTags = pendingTag && !form.tags.includes(pendingTag)
            ? [...form.tags, pendingTag]
            : form.tags;

        onSubmit({
            title,
            description: form.description.trim(),
            status: form.status,
            priority: form.priority,
            project,
            due: formatDueLabel(form.dueDate) || form.due.trim() || "No date",
            dueDate: form.dueDate || null,
            tags: allTags,
        });

        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="New task"
            description="Add the details now, or just the title — you can edit the rest later."
        >
            <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <fieldset className="fieldset">
                    <legend className="label">Title</legend>
                    <input
                        // Focus the first field when the dialog opens.
                        autoFocus
                        type="text"
                        value={form.title}
                        onChange={(event) => {
                            setField("title", event.target.value);
                            if (error) setError(null);
                        }}
                        placeholder="e.g. Draft the release notes"
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? "task-form-error" : undefined}
                        className={`input input-bordered w-full ${
                            error ? "input-error" : ""
                        }`}
                    />
                    {error && (
                        <p id="task-form-error" className="mt-1 text-sm text-error">
                            {error}
                        </p>
                    )}
                </fieldset>

                {/* Description */}
                <fieldset className="fieldset">
                    <legend className="label">Description</legend>
                    <textarea
                        value={form.description}
                        onChange={(event) => setField("description", event.target.value)}
                        rows={3}
                        placeholder="What does done look like?"
                        className="textarea textarea-bordered w-full resize-y"
                    />
                </fieldset>

                {/* Status + priority */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <fieldset className="fieldset">
                        <legend className="label">Status</legend>
                        <select
                            value={form.status}
                            onChange={(event) =>
                                setField("status", event.target.value as TodoState)
                            }
                            className="select select-bordered w-full"
                        >
                            {BOARD_COLUMNS.map((value) => (
                                <option key={value} value={value}>
                                    {STATUS_LABELS[value]}
                                </option>
                            ))}
                        </select>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="label">Priority</legend>
                        <select
                            value={form.priority}
                            onChange={(event) =>
                                setField("priority", event.target.value as Priority)
                            }
                            className="select select-bordered w-full"
                        >
                            {PRIORITIES.map((value) => (
                                <option key={value} value={value}>
                                    {capitalize(value)}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                </div>

                {/* Project + due date */}
                <div className="grid gap-5 sm:grid-cols-2">
                    <fieldset className="fieldset">
                        <legend className="label">Project</legend>
                        <input
                            type="text"
                            list="task-form-projects"
                            value={form.project}
                            onChange={(event) => setField("project", event.target.value)}
                            placeholder={projects[0] ?? INBOX_PROJECT}
                            className="input input-bordered w-full"
                        />
                        <datalist id="task-form-projects">
                            {projects.map((project) => (
                                <option key={project} value={project} />
                            ))}
                        </datalist>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="label">Due date</legend>
                        <input
                            type="date"
                            value={form.dueDate}
                            onChange={(event) => setField("dueDate", event.target.value)}
                            className="input input-bordered w-full"
                        />
                    </fieldset>
                </div>

                {/* Tags */}
                <fieldset className="fieldset">
                    <legend className="label">Tags</legend>

                    {form.tags.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1">
                            {form.tags.map((tag) => (
                                <span key={tag} className="badge badge-ghost gap-1">
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        aria-label={`Remove tag ${tag}`}
                                        className="text-base-content/50 hover:text-error"
                                    >
                                        ✕
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={tagDraft}
                            onChange={(event) => setTagDraft(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === ",") {
                                    event.preventDefault();
                                    addTag(tagDraft);
                                }
                            }}
                            placeholder="Type a tag then press Enter"
                            className="input input-bordered w-full"
                            aria-label="Add a tag"
                        />
                        <button
                            type="button"
                            onClick={() => addTag(tagDraft)}
                            disabled={!tagDraft.trim()}
                            className="btn btn-outline"
                        >
                            Add
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                            <span className="text-xs text-base-content/50">
                                Suggestions:
                            </span>
                            {tags.slice(0, 6).map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => addTag(tag)}
                                    disabled={form.tags.includes(tag)}
                                    className="btn btn-ghost btn-xs"
                                >
                                    {form.tags.includes(tag) ? `✓ #${tag}` : `#${tag}`}
                                </button>
                            ))}
                        </div>
                    )}
                </fieldset>
            </form>

            <div className="modal-action">
                <button type="button" onClick={onClose} className="btn btn-ghost">
                    Cancel
                </button>
                <button type="submit" form="task-form" className="btn btn-primary">
                    Add task
                </button>
            </div>
        </Modal>
    );
};

export default TaskFormModal;
