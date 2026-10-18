import Link from "next/link";

const SignUpPage = () => {
    return (
        <div className="flex min-h-screen">
            {/* Brand panel */}
            <aside className="hidden lg:flex relative flex-1 flex-col justify-between overflow-hidden bg-secondary p-12 text-secondary-content">
                {/* Decorative shapes */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -right-24 size-96 rounded-full bg-secondary-content/10 blur-2xl" />
                    <div className="absolute bottom-0 left-0 size-112 rounded-full bg-primary/40 blur-3xl" />
                    <div className="absolute top-1/3 left-10 size-40 rounded-3xl -rotate-12 bg-secondary-content/10" />
                </div>

                <Link href="/" className="relative flex items-center gap-3 text-xl font-bold">
                    <span className="grid size-9 place-items-center rounded-xl bg-secondary-content text-secondary">
                        ✓
                    </span>
                    TaskFlow
                </Link>

                <div className="relative space-y-4">
                    <h2 className="max-w-md text-4xl font-bold leading-tight">
                        Your best work starts today.
                    </h2>
                    <p className="max-w-md text-secondary-content/80">
                        Join thousands of teams who plan smarter, ship faster, and stay
                        organized with TaskFlow.
                    </p>

                    <ul className="space-y-2 text-secondary-content/90">
                        <li className="flex items-center gap-2">
                            <span className="grid size-5 place-items-center rounded-full bg-secondary-content/20 text-xs">
                                ✓
                            </span>
                            Free for up to 3 projects
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="grid size-5 place-items-center rounded-full bg-secondary-content/20 text-xs">
                                ✓
                            </span>
                            No credit card required
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="grid size-5 place-items-center rounded-full bg-secondary-content/20 text-xs">
                                ✓
                            </span>
                            Cancel anytime
                        </li>
                    </ul>
                </div>

                <figure className="relative max-w-md">
                    <blockquote className="text-lg italic leading-relaxed">
                        &ldquo;We switched to TaskFlow on day one of our trial. Two years
                        later, it&apos;s still the first app we open every morning.&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-3">
                        <div className="avatar">
                            <div className="size-10 rounded-full ring ring-secondary-content/40">
                                <span className="grid h-full w-full place-items-center text-sm font-semibold">
                                    SK
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold">Sara Kim</div>
                            <div className="text-sm text-secondary-content/70">
                                Engineering Manager, Northwind
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </aside>

            {/* Form panel */}
            <main className="flex flex-1 items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm">
                    <Link
                        href="/"
                        className="mb-8 flex items-center gap-2 text-xl font-bold lg:hidden"
                    >
                        <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-content">
                            ✓
                        </span>
                        TaskFlow
                    </Link>

                    <header className="mb-8">
                        <h1 className="text-3xl font-bold">Create your account</h1>
                        <p className="mt-2 text-base-content/60">
                            Start organizing your work in minutes
                        </p>
                    </header>

                    <form className="space-y-5" action="#">
                        {/* Full name */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="name">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                placeholder="Jane Doe"
                                className="input input-bordered w-full"
                            />
                        </fieldset>

                        {/* Email */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="you@example.com"
                                className="input input-bordered w-full"
                            />
                        </fieldset>

                        {/* Password */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                minLength={8}
                                required
                                placeholder="At least 8 characters"
                                className="input input-bordered w-full"
                            />
                            <p className="mt-1 text-xs text-base-content/50">
                                Must be at least 8 characters long.
                            </p>
                        </fieldset>

                        {/* Confirm password */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="confirm-password">
                                Confirm password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                minLength={8}
                                required
                                placeholder="••••••••"
                                className="input input-bordered w-full"
                            />
                        </fieldset>

                        {/* Terms */}
                        <label className="label cursor-pointer justify-start gap-2">
                            <input
                                type="checkbox"
                                name="terms"
                                required
                                className="checkbox checkbox-sm"
                            />
                            <span className="label-text">
                                I agree to the{" "}
                                <Link href="/terms" className="link link-primary">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="link link-primary">
                                    Privacy Policy
                                </Link>
                            </span>
                        </label>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary w-full">
                            Create account
                        </button>

                        {/* Divider */}
                        <div className="divider text-xs text-base-content/50">
                            or sign up with
                        </div>

                        {/* Social sign up */}
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" className="btn btn-outline">
                                <svg aria-hidden className="size-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M21.35 11.1H12v2.9h5.35c-.5 2.5-2.6 3.9-5.35 3.9a6 6 0 1 1 0-12c1.5 0 2.85.55 3.9 1.45l2.15-2.15A9 9 0 1 0 12 21c5.2 0 9-3.6 9-9 0-.3 0-.6-.05-.9Z"
                                    />
                                </svg>
                                Google
                            </button>
                            <button type="button" className="btn btn-outline">
                                <svg aria-hidden className="size-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
                                    />
                                </svg>
                                GitHub
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-center text-sm text-base-content/60">
                        Already have an account?{" "}
                        <Link href="/signin" className="link link-primary font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SignUpPage;
