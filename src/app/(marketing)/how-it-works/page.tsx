import Link from "next/link";
import type { ReactNode } from "react";

type Step = {
    /** Position in the flow, used for the badge number. */
    number: number;
    /** daisyUI color token used for the icon chip. */
    token: string;
    title: string;
    summary: string;
    details: string[];
    icon: ReactNode;
};

const icon = (path: string, extra?: string) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="currentColor"
        aria-hidden
    >
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        {extra && <path strokeLinecap="round" strokeLinejoin="round" d={extra} />}
    </svg>
);

const STEPS: Step[] = [
    {
        number: 1,
        token: "primary",
        title: "Capture the work",
        summary:
            "Open the task form and write down what needs doing while it is still in your head.",
        details: [
            "Title, description, priority, project, due date, and tags in one form.",
            "New tasks land in the To do column, ready to be picked up.",
            "Edit any field later — nothing is locked after it is saved.",
        ],
        icon: icon(
            "M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125",
        ),
    },
    {
        number: 2,
        token: "info",
        title: "Triage and slice",
        summary:
            "Narrow the board down to the work that matters right now, using the filter bar.",
        details: [
            "Search across titles, descriptions, projects, and tags.",
            "Filter by priority, project, assignee, or label.",
            "Switch the sidebar to a single status to focus on one column.",
        ],
        icon: icon(
            "M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.008v.008H3.75V6.75Zm0 5.25h.008v.008H3.75V12Zm0 5.25h.008v.008H3.75v-.008Z",
        ),
    },
    {
        number: 3,
        token: "secondary",
        title: "Work the board",
        summary:
            "Drag a card the moment you start it, and again the moment you finish it.",
        details: [
            "Move tasks across To do, In progress, and Completed.",
            "Column counts, percentages, and progress bars update instantly.",
            "Overdue and due-this-week tasks surface on their own.",
        ],
        icon: icon(
            "M4.5 6.75h5.25v10.5H4.5V6.75Zm7.5-3h5.25v13.5H12V3.75Z",
        ),
    },
    {
        number: 4,
        token: "accent",
        title: "Read the numbers",
        summary:
            "Open analytics to see where the work actually stands before planning the next week.",
        details: [
            "Donut chart of your workload by status.",
            "Bar charts that break work down by priority and project.",
            "Completion rate, overdue list, and a seven-day lookahead.",
        ],
        icon: icon(
            "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
        ),
    },
];

const LOOP = [
    { label: "Plan", detail: "Capture and triage" },
    { label: "Do", detail: "Move the cards" },
    { label: "Review", detail: "Read the analytics" },
    { label: "Repeat", detail: "Plan the next week" },
];

const PILLARS = [
    {
        title: "One source of truth",
        description:
            "Tasks, projects, and deadlines live on the same board, so status questions stop turning into message threads.",
        icon: icon(
            "M3.75 6.75h16.5v10.5H3.75V6.75Zm0 5.25h16.5M8.25 6.75v10.5",
        ),
    },
    {
        title: "Live numbers, no spreadsheets",
        description:
            "Counts and percentages recalculate the instant a card moves, so the plan always matches reality.",
        icon: icon(
            "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Z",
        ),
    },
    {
        title: "Deadlines you cannot miss",
        description:
            "Overdue and due-this-week views are computed from your due dates automatically — no check-ins required.",
        icon: icon(
            "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        ),
    },
    {
        title: "Ready in a minute",
        description:
            "Sign up with an email and a password, and the board is already there — no setup, no import, no credit card.",
        icon: icon(
            "M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
        ),
    },
];

export default function HowItWorksPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
            {/* Header */}
            <header className="mx-auto max-w-2xl text-center">
                <span className="badge badge-primary badge-soft">How it works</span>
                <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                    From a messy to-do list to a finished day
                </h1>
                <p className="mt-4 text-base-content/60">
                    TaskFlow turns work into four simple moves: capture it, slice it,
                    ship it, and learn from it. No configuration, no setup calls.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/" className="btn btn-primary">
                        Open the board
                    </Link>
                    <Link href="/features" className="btn btn-outline">
                        See all features
                    </Link>
                </div>
            </header>

            {/* Steps */}
            <section aria-label="How TaskFlow works" className="mt-14">
                <h2 className="text-center text-2xl font-bold">Four steps, one board</h2>
                <p className="mt-2 text-center text-sm text-base-content/60">
                    The same loop every day — it gets faster the more you use it.
                </p>

                <ol className="mt-8 grid gap-4 sm:grid-cols-2">
                    {STEPS.map((step) => (
                        <li key={step.title}>
                            <article className="card h-full rounded-box border border-base-300 bg-base-100 shadow-sm">
                                <div className="card-body gap-3 p-5">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className="grid size-11 shrink-0 place-items-center rounded-box"
                                            style={{
                                                background: `color-mix(in oklab, var(--color-${step.token}) 15%, transparent)`,
                                                color: `var(--color-${step.token})`,
                                            }}
                                        >
                                            {step.icon}
                                        </span>
                                        <div className="min-w-0">
                                            <span className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                                                Step {step.number}
                                            </span>
                                            <h3 className="truncate font-semibold">
                                                {step.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-sm text-base-content/70">
                                        {step.summary}
                                    </p>

                                    <ul className="mt-1 space-y-1.5">
                                        {step.details.map((detail) => (
                                            <li
                                                key={detail}
                                                className="flex gap-2 text-sm text-base-content/60"
                                            >
                                                <span
                                                    aria-hidden
                                                    className="mt-2 size-1.5 shrink-0 rounded-full bg-base-content/40"
                                                />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        </li>
                    ))}
                </ol>
            </section>

            {/* The loop */}
            <section aria-label="The TaskFlow loop" className="mt-16">
                <div className="card rounded-box border border-base-300 bg-base-100 shadow-sm">
                    <div className="card-body gap-6 p-6 sm:p-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold">A loop you can repeat daily</h2>
                            <p className="mt-2 text-sm text-base-content/60">
                                Finish the week knowing exactly what moved and what
                                slipped.
                            </p>
                        </div>

                        <ul className="steps steps-horizontal w-full">
                            {LOOP.map((stage) => (
                                <li
                                    key={stage.label}
                                    className="step step-primary text-center"
                                >
                                    <span className="text-sm font-semibold">
                                        {stage.label}
                                    </span>
                                    <span className="block text-xs font-normal text-base-content/60">
                                        {stage.detail}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Why it works */}
            <section aria-label="Why it works" className="mt-16">
                <h2 className="text-center text-2xl font-bold">Why it works</h2>
                <p className="mt-2 text-center text-sm text-base-content/60">
                    Built around the habits that keep projects moving.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {PILLARS.map((pillar) => (
                        <article
                            key={pillar.title}
                            className="card rounded-box border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="card-body gap-2 p-5">
                                <span className="grid size-9 place-items-center rounded-box bg-base-content/10 text-base-content/70">
                                    {pillar.icon}
                                </span>
                                <h3 className="card-title text-base">{pillar.title}</h3>
                                <p className="text-sm text-base-content/60">
                                    {pillar.description}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Closing call to action */}
            <section className="card mt-16 bg-primary text-primary-content shadow-2xl shadow-primary/25">
                <div className="card-body items-center gap-4 p-8 text-center sm:p-12">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Ready to run your week like this?
                    </h2>
                    <p className="max-w-xl text-primary-content/80">
                        Create an account, add one task, and drag it to Completed.
                        That is the whole setup.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/signup" className="btn btn-secondary">
                            Get started — Free
                        </Link>
                        <Link
                            href="/analytics"
                            className="btn btn-ghost text-primary-content"
                        >
                            See the analytics
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
