"use client";

import { useCallback, useState } from "react";
import { RefreshCw } from "lucide-react";
import Appbar from "@/components/ui/Appbar";
import { MarketsSummary } from "@/components/markets/MarketsSummary";
import { MarketHighlights } from "@/components/markets/MarketHighlights";
import { MarketsTable } from "@/components/markets/MarketsTable";
import { CombineData } from "@/app/utils/combine-data";
import { usePolling } from "@/app/utils/usePolling";

const FAVORITES_KEY = "nx-favorites";
const REFRESH_MS = 30_000;

export default function MarketsPage() {
  const { data, error, loading, refresh } = usePolling(CombineData, REFRESH_MS);

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = useCallback((symbol: string) => {
    setFavorites((prev) => {
      const next = prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // Private browsing / quota — favorites just won't persist.
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      <Appbar />

      <main className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Markets</h1>
            <p className="mt-1 text-sm text-[var(--nx-text-secondary)]">
              Live prices across every tracked asset, refreshed every 30
              seconds.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-2 rounded-[var(--nx-radius)] border border-[var(--nx-border-strong)] px-3 py-2 text-sm font-medium text-[var(--nx-text-secondary)] transition-colors hover:border-[var(--nx-text-tertiary)] hover:text-[var(--nx-text)]"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && !data && (
          <div
            role="alert"
            className="mb-5 rounded-[var(--nx-radius)] border border-[var(--nx-down)]/40 bg-[var(--nx-down-soft)] px-4 py-3 text-sm text-[var(--nx-down)]"
          >
            Couldn&apos;t load market data. Retrying automatically — or use
            Refresh to try now.
          </div>
        )}

        <div className="space-y-4">
          <MarketsSummary data={data} />
          <MarketHighlights data={data} />
          <MarketsTable
            data={data}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </main>
    </div>
  );
}
