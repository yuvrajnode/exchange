"use client";

import { useEffect, useRef, useState } from "react";
import { ChartManager } from "@/app/utils/ChartManager";
import { getKlines } from "@/app/utils/httpClient";
import { cn } from "@/lib/utils";

/** Interval → how far back to backfill, so each view shows a useful window. */
const INTERVALS = [
  { label: "15m", value: "15m", lookbackMs: 1000 * 60 * 60 * 24 },
  { label: "1H", value: "1h", lookbackMs: 1000 * 60 * 60 * 24 * 7 },
  { label: "4H", value: "4h", lookbackMs: 1000 * 60 * 60 * 24 * 30 },
  { label: "1D", value: "1d", lookbackMs: 1000 * 60 * 60 * 24 * 180 },
] as const;

export function PriceChart({ market }: { market: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ChartManager | null>(null);
  const [interval, setInterval] = useState<string>("1h");
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const config = INTERVALS.find((i) => i.value === interval) ?? INTERVALS[1];
    const startTime = String(
      Math.floor((Date.now() - config.lookbackMs) / 1000)
    );

    getKlines({ market, interval, startTime })
      .then((klines) => {
        if (cancelled || !containerRef.current) return;
        setError(false);

        chartRef.current?.destroy();
        chartRef.current = new ChartManager(
          containerRef.current,
          klines
            .map((k) => ({
              open: parseFloat(k.open),
              high: parseFloat(k.high),
              low: parseFloat(k.low),
              close: parseFloat(k.close),
              timestamp: new Date(k.end).getTime(),
            }))
            .sort((a, b) => a.timestamp - b.timestamp),
          { background: "transparent", color: "#949dac" }
        );
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [market, interval]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-[var(--nx-border)] px-3 py-2">
        <span className="nx-label mr-2">Interval</span>
        {INTERVALS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setInterval(option.value)}
            aria-pressed={interval === option.value}
            className={cn(
              "rounded-[var(--nx-radius-sm)] px-2.5 py-1 text-xs font-medium transition-colors",
              interval === option.value
                ? "bg-[var(--nx-surface-hover)] text-[var(--nx-text)]"
                : "text-[var(--nx-text-secondary)] hover:text-[var(--nx-text)]"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1">
        {error && (
          <p className="absolute inset-0 z-10 flex items-center justify-center text-sm text-[var(--nx-text-secondary)]">
            Chart data unavailable.
          </p>
        )}
        {/* Fills the grid cell rather than a hard-coded 520px. */}
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </div>
  );
}
