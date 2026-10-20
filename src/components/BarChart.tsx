"use client";

import type { ChartDatum } from "@/lib/todos";

type BarChartProps = {
    data: ChartDatum[];
    /** Value the longest bar represents. Defaults to the largest count. */
    max?: number;
    /** Value shown at the end of each bar. Defaults to the raw count. */
    valueSuffix?: string;
};

/**
 * Horizontal bar chart.
 * Bars are plain divs colored with daisyUI theme tokens, so the chart re-themes
 * with light/dark mode and needs no charting dependency.
 */
const BarChart = ({ data, max, valueSuffix = "" }: BarChartProps) => {
    const largest = max ?? Math.max(1, ...data.map((item) => item.value));

    if (data.length === 0) {
        return <p className="py-8 text-center text-sm text-base-content/50">No data yet</p>;
    }

    return (
        <ul className="space-y-4">
            {data.map((item) => {
                const width = Math.max(0, Math.min(100, (item.value / largest) * 100));

                return (
                    <li key={item.key} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3 text-sm">
                            <span className="truncate font-medium">{item.label}</span>
                            <span className="shrink-0 tabular-nums text-base-content/60">
                                {item.value}
                                {valueSuffix}
                            </span>
                        </div>

                        <div
                            role="meter"
                            aria-valuenow={item.value}
                            aria-valuemin={0}
                            aria-valuemax={largest}
                            aria-label={item.label}
                            className="h-2.5 w-full overflow-hidden rounded-full bg-base-300"
                        >
                            <div
                                className="h-full rounded-full transition-[width] duration-500"
                                style={{
                                    width: `${width}%`,
                                    background: `var(--color-${item.token})`,
                                }}
                            />
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default BarChart;
