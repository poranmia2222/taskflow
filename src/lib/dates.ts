/**
 * Date helpers shared by the calendar, the focus timer, and the task lists.
 *
 * A task deadline is stored as an ISO `YYYY-MM-DD` string (see `Todo.dueDate`),
 * so every helper here works in local time and avoids the UTC shift that
 * `new Date("2026-10-21")` would introduce.
 */

/** `YYYY-MM-DD` key for a local date. */
export function toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/** Parses a `YYYY-MM-DD` key into a local date at midnight. */
export function parseDateKey(key: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return Number.isNaN(date.getTime()) ? null : date;
}

/** Midnight of the given date, without mutating the original. */
export function startOfDay(date: Date): Date {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);

    return copy;
}

/** The first day of the month the date belongs to. */
export function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

/** Adds (or subtracts) days, keeping the time of day. */
export function addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);

    return copy;
}

/**
 * Adds (or subtracts) months.
 *
 * The day is pinned to the 1st first, so moving from January to February never
 * overflows into March.
 */
export function addMonths(date: Date, months: number): Date {
    const copy = new Date(date.getFullYear(), date.getMonth() + months, 1);

    return copy;
}

export function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/** Whole days between two dates, ignoring the time of day. */
export function differenceInDays(later: Date, earlier: Date): number {
    const ms = startOfDay(later).getTime() - startOfDay(earlier).getTime();

    return Math.round(ms / 86_400_000);
}

/**
 * A short, human label for a deadline: "Today", "Tomorrow", "Yesterday", or a
 * date such as "Oct 22". Falls back to the label stored on the task.
 */
export function formatDueLabel(
    dueDate: string | null,
    fallback: string,
    today: Date,
): string {
    const date = dueDate ? parseDateKey(dueDate) : null;
    if (!date) return fallback;

    const diff = differenceInDays(date, today);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff === -1) return "Yesterday";

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
