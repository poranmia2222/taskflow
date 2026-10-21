"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import UserAvatar from "@/components/UserAvatar";
import { signOut, useSession } from "@/lib/auth-client";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Analytics", href: "/analytics" },
    { label: "Features", href: "/features" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
];

const PROFILE_LINKS = [
    { label: "Profile", href: "/profile" },
    { label: "Settings", href: "/settings" },
];

const Navbar = () => {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [isSigningOut, setSigningOut] = useState(false);

    const user = session?.user;
    // `useSession` may expose an image field depending on the configured plugins.
    const userImage = (user as { image?: string | null } | undefined)?.image;

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
        setSigningOut(false);
        router.push("/signin");
        router.refresh();
    };

    return (
        <header className="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100 px-2">
            {/* Part 1: Logo + mobile menu toggle */}
            <div className="navbar-start">
                {/* Mobile menu */}
                <div className="dropdown lg:hidden">
                    <label tabIndex={0} className="btn btn-ghost btn-square" aria-label="Open menu">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content z-50 mt-2 w-56 rounded-box bg-base-100 p-2 shadow-lg ring-1 ring-base-200"
                    >
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                        <li>
                            <div className="divider my-1" />
                        </li>

                        <li>
                            <ThemeToggle variant="menu" />
                        </li>

                        {user ? (
                            <>
                                <li>
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <UserAvatar
                                            name={user.name}
                                            src={userImage}
                                            size="size-9"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-base-content/60">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                                {PROFILE_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href}>{link.label}</Link>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        className="text-error"
                                    >
                                        {isSigningOut ? "Signing out…" : "Sign out"}
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link href="/signin">Sign in</Link>
                                </li>
                                <li>
                                    <Link
                                        href="/signup"
                                        className="btn btn-primary btn-sm mt-1"
                                    >
                                        Get started — Free
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Logo */}
                <Link href="/" className="btn btn-ghost gap-2 px-2 text-lg font-bold">
                    <span className="grid size-7 place-items-center rounded-lg bg-primary text-sm text-primary-content">
                        ✓
                    </span>
                    TaskFlow
                    <span className="badge badge-secondary badge-sm">Free</span>
                </Link>
            </div>

            {/* Part 2: Route links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-1 px-1">
                    {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                            <Link href={link.href} className="rounded-btn">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Part 3: Auth actions */}
            <div className="navbar-end gap-1">
                <ThemeToggle />
                {isPending ? (
                    // Placeholder keeps the navbar from shifting once the session loads.
                    <span
                        aria-hidden
                        className="skeleton size-9 rounded-full"
                    />
                ) : user ? (
                    <div className="dropdown dropdown-end">
                        <button
                            type="button"
                            tabIndex={0}
                            aria-label="Account menu"
                            className="btn btn-ghost btn-circle avatar"
                        >
                            <UserAvatar name={user.name} src={userImage} size="size-9" />
                        </button>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content z-50 mt-3 w-60 rounded-box bg-base-100 p-2 shadow-lg ring-1 ring-base-200"
                        >
                            <li className="menu-title">
                                <div className="flex items-center gap-3">
                                    <UserAvatar
                                        name={user.name}
                                        src={userImage}
                                        size="size-10"
                                        textSize="text-sm"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-base-content">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-xs text-base-content/60">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </li>
                            {PROFILE_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href}>{link.label}</Link>
                                </li>
                            ))}
                            <li>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    disabled={isSigningOut}
                                    className="text-error"
                                >
                                    {isSigningOut ? "Signing out…" : "Sign out"}
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <>
                        <Link href="/signin" className="btn btn-ghost hidden sm:inline-flex">
                            Sign in
                        </Link>
                        <Link href="/signup" className="btn btn-primary">
                            Get started — Free
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;
