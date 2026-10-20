"use client";

import type { ChartDatum } from "@/lib/todos";

type DonutChartProps = {
    data: ChartDatum[];
    /** Text shown in the middle of the ring. Defaults to the total. */
    centerLabel?: string;
    /** Caption under the center value. */
    centerCaption?: string;
    /** Diameter classes, e.g. `size-40`. */
    size?: string;
};

/**
 * Donut chart built from a CSS conic-gradient — no charting library needed.
 *
 * Each slice is colored with a daisyUI theme token via `var(--color-*)`, so the
 * chart follows the active light/dark theme automatically.
 */
const DonutChart = ({
    data,
    centerLabel,
    centerCaption,
    size = "size-40",
}: DonutChartProps) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Build the gradient stops. Zero-width slices are skipped so they can't
    // create a stray hairline in the ring.
    const stops: string[] = [];
    let cursor = 0;

    for (const item of data) {
        if (item.value <= 0) continue;
        const start = (cursor / total) * 100;
        cursor += item.value;
        const end = (cursor / total) * 100;
        stops.push(`var(--color-${item.token}) ${start}% ${end}%`);
    }

    const gradient =
        total === 0 || stops.length === 0
            ? "var(--color-base-300) 0% 100%"
            : `conic-gradient(${stops.join(", ")})`;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className={`relative grid place-items-center rounded-full ${size}`}>
                <div
                    aria-hidden
                    className="absolute inset-0 rounded-full"
                    style={{ background: gradient }}
                />
                {/* Inner cutout turns the pie into a donut. */}
                <div className="absolute inset-4 grid place-items-center rounded-full bg-base-100 text-center">
                    <div>
                        <div className="text-2xl font-bold tabular-nums">
                            {centerLabel ?? total}
                        </div>
                        {centerCaption && (
                            <div className="text-[0.7rem] text-base-content/60">
                                {centerCaption}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ul className="w-full space-y-2">
                {data.map((item) => (
                    <li key={item.key} className="flex items-center gap-2 text-sm">
                        <span
                            aria-hidden
                            className="size-3 shrink-0 rounded-full"
                            style={{ background: `var(--color-${item.token})` }}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="tabular-nums text-base-content/60">
                            {item.value}
                        </span>
                        <span className="w-10 text-right tabular-nums text-xs text-base-content/50">
                            {total === 0 ? "0%" : `${Math.round((item.value / total) * 100)}%`}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DonutChart;
