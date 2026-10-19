"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import { signOut, useSession } from "@/lib/auth-client";

const formatDate = (value?: string | Date | null) => {
    if (!value) return "—";
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const ProfilePage = () => {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [isSigningOut, setSigningOut] = useState(false);

    const user = session?.user;
    const userImage = (user as { image?: string | null } | undefined)?.image;

    // Send signed-out visitors to the sign-in page.
    useEffect(() => {
        if (!isPending && !user) {
            router.replace("/signin");
        }
    }, [isPending, user, router]);

    const handleSignOut = async () => {
        setSigningOut(true);
        await signOut();
        setSigningOut(false);
        router.push("/signin");
        router.refresh();
    };

    if (isPending || !user) {
        return (
            <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-24">
                <span className="loading loading-spinner loading-lg text-primary" />
                <span className="sr-only">Loading profile</span>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-8">
            <header className="mb-6">
                <p className="text-sm font-medium text-primary">Account</p>
                <h1 className="mt-1 text-3xl font-bold">Your profile</h1>
            </header>

            {/* Identity */}
            <section className="card card-border bg-base-100 shadow-sm">
                <div className="flex flex-col items-center gap-4 p-6 sm:flex-row sm:items-center">
                    <UserAvatar
                        name={user.name}
                        src={userImage}
                        size="size-20"
                        textSize="text-2xl"
                    />

                    <div className="min-w-0 flex-1 text-center sm:text-left">
                        <h2 className="truncate text-xl font-semibold">{user.name}</h2>
                        <p className="truncate text-sm text-base-content/60">
                            {user.email}
                        </p>
                        <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                            <span className="badge badge-success badge-soft badge-sm">
                                {user.emailVerified ? "Email verified" : "Email unverified"}
                            </span>
                            <span className="badge badge-ghost badge-sm">Free plan</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details */}
            <section className="card card-border mt-6 bg-base-100 shadow-sm">
                <div className="card-body gap-0 p-0">
                    <h2 className="p-5 pb-3 text-sm font-semibold text-base-content/60">
                        Account details
                    </h2>
                    <dl className="divide-y divide-base-200">
                        <div className="flex items-center justify-between gap-4 px-5 py-3">
                            <dt className="text-sm text-base-content/60">User ID</dt>
                            <dd className="truncate font-mono text-xs">{user.id}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-4 px-5 py-3">
                            <dt className="text-sm text-base-content/60">Name</dt>
                            <dd className="truncate text-sm font-medium">{user.name}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-4 px-5 py-3">
                            <dt className="text-sm text-base-content/60">Email</dt>
                            <dd className="truncate text-sm font-medium">{user.email}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-4 px-5 py-3">
                            <dt className="text-sm text-base-content/60">Member since</dt>
                            <dd className="text-sm font-medium">
                                {formatDate(user.createdAt)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/" className="btn btn-outline">
                    Back to workspace
                </Link>
                <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="btn btn-error btn-soft ml-auto"
                >
                    {isSigningOut ? "Signing out…" : "Sign out"}
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
