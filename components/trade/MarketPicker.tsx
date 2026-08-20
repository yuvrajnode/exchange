"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Search } from "lucide-react";
import { getTickers } from "@/app/utils/httpClient";
import type { Ticker } from "@/app/utils/types";
import { Change } from "@/components/ui/primitives/Change";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Switching markets previously meant navigating back to the markets list.
 * This keeps the trader on the terminal.
 */
export function MarketPicker({ market }: { market: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || tickers.length) return;
    getTickers()
      .then(setTickers)
      .catch(() => {});
  }, [open, tickers.length]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickers
      // Spot only: this terminal renders BASE_QUOTE, so perpetuals
      // (BTC_USDC_PERP) would show a mislabelled quote asset.
      .filter((t) => t.symbol.split("_").length === 2)
      .filter((t) => (q ? t.symbol.toLowerCase().includes(q) : true))
      .sort((a, b) => Number(b.quoteVolume) - Number(a.quoteVolume))
      .slice(0, 40);
  }, [tickers, query]);

  const [base, quote] = market.split("_");

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 rounded-[var(--nx-radius)] px-2 py-1.5 text-base font-semibold transition-colors hover:bg-[var(--nx-surface-hover)]"
      >
        {base}
        <span className="text-[var(--nx-text-tertiary)]">/{quote}</span>
        <ChevronDown
          className={cn(
            "size-4 text-[var(--nx-text-tertiary)] transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-[var(--nx-radius-lg)] border border-[var(--nx-border-strong)] bg-[var(--nx-surface)] shadow-[var(--nx-shadow-lg)]"
        >
          <div className="relative border-b border-[var(--nx-border)] p-2">
            <Search
              className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-[var(--nx-text-tertiary)]"
              aria-hidden
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search markets"
              aria-label="Search markets"
              className="h-9 w-full rounded-[var(--nx-radius-sm)] bg-[var(--nx-surface-sunken)] pl-9 pr-3 text-sm outline-none placeholder:text-[var(--nx-text-tertiary)]"
            />
          </div>

          <ul className="nx-scroll max-h-80 overflow-y-auto">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-[var(--nx-text-secondary)]">
                {tickers.length ? "No markets match." : "Loading markets…"}
              </li>
            ) : (
              results.map((ticker) => {
                const active = ticker.symbol === market;
                return (
                  <li key={ticker.symbol}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => {
                        setOpen(false);
                        router.push(`/trade/${ticker.symbol}`);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-[var(--nx-surface-hover)]"
                    >
                      <span className="flex-1 text-sm font-medium">
                        {ticker.symbol.replace("_", "/")}
                      </span>
                      <span className="nx-num text-xs text-[var(--nx-text-secondary)]">
                        {formatPrice(ticker.lastPrice)}
                      </span>
                      <Change
                        value={Number(ticker.priceChangePercent) * 100}
                        className="w-20 justify-end text-xs"
                      />
                      {active && (
                        <Check className="size-3.5 text-[var(--nx-accent)]" aria-hidden />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
