"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    /** Footer actions, usually the submit and cancel buttons. */
    footer?: ReactNode;
    className?: string;
};

/**
 * Accessible modal dialog built on the native `<dialog>` element.
 *
 * Escape handling, focus trapping, and backdrop inertness come from the
 * browser; this component only syncs open/close state and restores scrolling.
 */
const Modal = ({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    className = "",
}: ModalProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const id = useId();
    const titleId = `${id}-title`;
    const descriptionId = `${id}-description`;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
            document.body.style.overflow = "hidden";
        } else if (!open && dialog.open) {
            dialog.close();
            document.body.style.overflow = "";
        }
    }, [open]);

    useEffect(() => {
        // Restore scrolling if the component unmounts while still open.
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            onCancel={(event) => {
                // Keep React state in sync when Escape is pressed.
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                // Close only when the backdrop itself is clicked.
                if (event.target === dialogRef.current) onClose();
            }}
            className="modal modal-bottom sm:modal-middle"
        >
            <div className={`modal-box w-full max-w-lg ${className}`}>
                <header className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 id={titleId} className="text-lg font-bold">
                            {title}
                        </h2>
                        {description && (
                            <p
                                id={descriptionId}
                                className="mt-1 text-sm text-base-content/60"
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="btn btn-ghost btn-sm btn-square"
                    >
                        ✕
                    </button>
                </header>

                {children}

                {footer && <div className="modal-action">{footer}</div>}
            </div>
        </dialog>
    );
};

export default Modal;
