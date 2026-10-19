import Link from "next/link";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "FAQ", href: "/faq" },
];

const Navbar = () => {
    return (
        <header className="navbar sticky top-0 z-50 border-b border-base-200 bg-base-100/90 shadow-sm backdrop-blur">
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
                            <Link href="/signin">Sign in</Link>
                        </li>
                        <li>
                            <Link href="/signup" className="btn btn-primary btn-sm mt-1">
                                Get started — Free
                            </Link>
                        </li>
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
            <div className="navbar-end gap-2">
                <Link href="/signin" className="btn btn-ghost hidden sm:inline-flex">
                    Sign in
                </Link>
                <Link href="/signup" className="btn btn-primary">
                    Get started — Free
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
