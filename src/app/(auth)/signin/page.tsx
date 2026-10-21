'use client'
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

const SignInPage = () => {

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const userData = Object.fromEntries(formData.entries())
            console.log(userData)
            const { data: resData, error } = await signIn.email({
                email: userData.email as string,
                password: userData.password as string,
                callbackURL: '/'
            })
            if (error) {
                console.error(error.message);
                return;
            }
            console.log(resData);
        }

     const signInWithGoogle = async () => {
        try {
            const { error } = await signIn.social({
                provider: 'google',
                callbackURL: '/',
            });

            if (error) {
                console.log(error.message || 'Google sign-in failed!');
            }
        } catch {
            console.log('Google sign-in failed!');
        }
    };
    return (
        <main className="flex min-h-screen">
            {/* Brand panel */}
            <aside className="hidden lg:flex relative flex-1 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-content">
                {/* Decorative shapes */}
                <div aria-hidden className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 -left-24 size-96 rounded-full bg-primary-content/10 blur-2xl" />
                    <div className="absolute bottom-0 right-0 size-112 rounded-full bg-secondary/40 blur-3xl" />
                    <div className="absolute top-1/3 right-10 size-40 rounded-3xl rotate-12 bg-primary-content/10" />
                </div>

                <Link href="/" className="relative flex items-center gap-3 text-xl font-bold">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary-content text-primary">
                        ✓
                    </span>
                    TaskFlow
                </Link>

                <div className="relative space-y-4">
                    <h2 className="max-w-md text-4xl font-bold leading-tight">
                        Organize your work. Get things done.
                    </h2>
                    <p className="max-w-md text-primary-content/80">
                        Plan projects, track progress, and collaborate with your team — all in
                        one beautifully simple workspace.
                    </p>
                </div>

                <figure className="relative max-w-md">
                    <blockquote className="text-lg italic leading-relaxed">
                        &ldquo;TaskFlow cut our meeting time in half. Everything we need to know
                        is right on the board.&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 flex items-center gap-3">
                        <div className="avatar">
                            <div className="size-10 rounded-full ring ring-primary-content/40">
                                <span className="grid h-full w-full place-items-center text-sm font-semibold">
                                    JD
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="font-semibold">Jamie Doe</div>
                            <div className="text-sm text-primary-content/70">
                                Product Lead, Acme Inc.
                            </div>
                        </div>
                    </figcaption>
                </figure>
            </aside>

            {/* Form panel */}
            <section className="flex flex-1 items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-sm rounded-2xl border border-base-300 bg-base-100 p-8 shadow-xl">
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
                        <h1 className="text-3xl font-bold">Welcome back</h1>
                        <p className="mt-2 text-base-content/60">
                            Sign in to your account to continue
                        </p>
                    </header>

                    <form className="space-y-5"  onSubmit={handleSignIn}>
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
                            <div className="flex items-center justify-between">
                                <label className="label" htmlFor="password">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="link link-hover text-xs text-base-content/60"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="••••••••"
                                className="input input-bordered w-full"
                            />
                        </fieldset>

                        {/* Remember me */}
                        <label className="label cursor-pointer justify-start gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                className="checkbox checkbox-sm"
                            />
                            <span className="label-text">Remember me</span>
                        </label>

                        {/* Submit */}
                        <button type="submit" className="btn btn-primary w-full">
                            Sign in
                        </button>

                        {/* Divider */}
                        <div className="divider text-xs text-base-content/50">
                            or continue with
                        </div>

                        {/* Social sign in */}
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={signInWithGoogle} type="button" className="btn btn-outline">
                                
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
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="link link-primary font-semibold">
                            Sign up
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default SignInPage;
