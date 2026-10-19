"use client";

import { useState } from "react";

type UserAvatarProps = {
    /** Display name, used for the initials fallback and the alt text. */
    name?: string | null;
    /** Image URL. When missing or broken, initials are shown instead. */
    src?: string | null;
    /** Tailwind size classes for the outer circle, e.g. `size-8`. */
    size?: string;
    /** Tailwind text size for the initials fallback. */
    textSize?: string;
    className?: string;
};

/** First letters of up to two words, e.g. "Jane Doe" -> "JD". */
export function getInitials(name?: string | null): string {
    const trimmed = name?.trim();
    if (!trimmed) return "?";

    const parts = trimmed.split(/\s+/).slice(0, 2);
    return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

const UserAvatar = ({
    name,
    src,
    size = "size-8",
    textSize = "text-xs",
    className = "",
}: UserAvatarProps) => {
    // Tracks the source that failed to load, so a broken image falls back to
    // initials while a later valid source still renders.
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = Boolean(src) && failedSrc !== src;

    return (
        <span
            className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary font-semibold text-primary-content ${size} ${textSize} ${className}`}
        >
            {showImage && src ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote avatars have unknown hosts; next/image needs per-domain config.
                <img
                    src={src}
                    alt={name ? `${name}'s avatar` : "User avatar"}
                    onError={() => setFailedSrc(src)}
                    className="size-full object-cover"
                />
            ) : (
                // Fallback to initials when the user has no picture.
                <span aria-hidden>{getInitials(name)}</span>
            )}
        </span>
    );
};

export default UserAvatar;
