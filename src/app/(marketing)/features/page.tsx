import Link from "next/link";
import type { ReactNode } from "react";

type Feature = {
    /** daisyUI color token used for the icon chip. */
    token: string;
    title: string;
    description: string;
    href?: string;
    linkLabel?: string;
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

const FEATURES: Feature[] = [
    {
        token: "primary",
        title: "Kanban board",
        description:
            "Drag tasks between To do, In progress, and Completed. Counts and progress update the moment a card moves.",
        icon: icon(
            "M4.5 6.75h5.25v10.5H4.5V6.75Zm7.5-3h5.25v13.5H12V3.75Z",
        ),
    },
    {
        token: "info",
        title: "Live status sidebar",
        description:
            "Filter the board by status and watch every count, percentage, and progress bar stay in sync.",
        icon: icon(
            "M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.008v.008H3.75V6.75Zm0 5.25h.008v.008H3.75V12Zm0 5.25h.008v.008H3.75v-.008Z",
        ),
    },
    {
        token: "secondary",
        title: "Powerful filters",
        description:
            "Search across titles, projects, and tags, then narrow by priority, project, assignee, or label.",
        icon: icon(
            "m21 21-4.35-4.35M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z",
        ),
    },
    {
        token: "accent",
        title: "Analytics",
        description:
            "Donut and bar charts break down your workload by status, priority, and project — plus overdue and upcoming lists.",
        href: "/analytics",
        linkLabel: "View analytics",
        icon: icon(
            "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
        ),
    },
    {
        token: "success",
        title: "Task details",
        description:
            "Capture a description, status, priority, project, due date, and tags. Everything is editable as you go.",
        icon: icon(
            "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        ),
    },
    {
        token: "warning",
        title: "Dark and light themes",
        description:
            "Switch themes anytime from the navbar. Your choice is remembered and applies before the first paint.",
        icon: icon(
            "M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z",
        ),
    },
    {
        token: "error",
        title: "Deadline tracking",
        description:
            "Overdue and due-this-week tasks surface automatically so nothing slips through the cracks.",
        icon: icon(
            "M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
        ),
    },
    {
        token: "primary",
        title: "Secure accounts",
        description:
            "Email and password sign-up with session-aware navigation, an avatar menu, and a profile page.",
        href: "/signup",
        linkLabel: "Create an account",
        icon: icon(
            "M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
        ),
    },
];

const STEPS = [
    {
        title: "Create your account",
        description: "Sign up with an email and password — no credit card required.",
    },
    {
        title: "Add your tasks",
        description:
            "Capture what needs doing, then set the priority, project, and due date.",
    },
    {
        title: "Work the board",
        description:
            "Drag cards as work progresses and watch the numbers update live.",
    },
];

export default function FeaturesPage() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
            {/* Header */}
            <header className="mx-auto max-w-2xl text-center">
                <span className="badge badge-primary badge-soft">Features</span>
                <h1 className="mt-4 text-4xl font-bold sm:text-5xl">
                    Everything you need to stay on top of your work
                </h1>
                <p className="mt-4 text-base-content/60">
                    TaskFlow keeps planning and doing in one place — a live board, sharp
                    filters, and analytics that tell you where things actually stand.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/signup" className="btn btn-primary">
                        Get started — Free
                    </Link>
                    <Link href="/" className="btn btn-outline">
                        Open the board
                    </Link>
                </div>
            </header>

            {/* Feature grid */}
            <section aria-label="Product features" className="mt-14">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature) => (
                        <article
                            key={feature.title}
                            className="card rounded-box border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <div className="card-body gap-3 p-5">
                                <span
                                    className="grid size-11 place-items-center rounded-box"
                                    style={{
                                        background: `color-mix(in oklab, var(--color-${feature.token}) 15%, transparent)`,
                                        color: `var(--color-${feature.token})`,
                                    }}
                                >
                                    {feature.icon}
                                </span>

                                <h2 className="card-title text-base">{feature.title}</h2>
                                <p className="text-sm text-base-content/60">
                                    {feature.description}
                                </p>

                                {feature.href && (
                                    <div className="card-actions mt-1">
                                        <Link
                                            href={feature.href}
                                            className="link link-primary text-sm font-semibold"
                                        >
                                            {feature.linkLabel} →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section aria-label="How it works" className="mt-16">
                <h2 className="text-center text-2xl font-bold">How it works</h2>
                <p className="mt-2 text-center text-sm text-base-content/60">
                    Three steps from empty board to finished work.
                </p>

                <ol className="mt-8 grid gap-6 sm:grid-cols-3">
                    {STEPS.map((step, index) => (
                        <li key={step.title} className="flex flex-col gap-3">
                            <span className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-content">
                                {index + 1}
                            </span>
                            <h3 className="font-semibold">{step.title}</h3>
                            <p className="text-sm text-base-content/60">
                                {step.description}
                            </p>
                        </li>
                    ))}
                </ol>
            </section>

            {/* Closing call to action */}
            <section className="card mt-16 bg-primary text-primary-content shadow-2xl shadow-primary/25">
                <div className="card-body items-center gap-4 p-8 text-center sm:p-12">
                    <h2 className="text-2xl font-bold sm:text-3xl">
                        Ready to get organized?
                    </h2>
                    <p className="max-w-xl text-primary-content/80">
                        Start with the free plan and see how much lighter your week feels.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/signup" className="btn btn-secondary">
                            Create your account
                        </Link>
                        <Link
                            href="/analytics"
                            className="btn btn-ghost text-primary-content"
                        >
                            Explore analytics
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
