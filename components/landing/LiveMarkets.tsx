"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { getKlines, getTickers } from "@/app/utils/httpClient";
import type { Ticker } from "@/app/utils/types";
import { Change } from "@/components/ui/primitives/Change";
import { Sparkline } from "@/components/ui/primitives/Sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactUsd, formatPrice } from "@/lib/format";

const FEATURED = ["SOL_USDC", "BTC_USDC", "ETH_USDC", "JUP_USDC"];

export function LiveMarkets() {
  const [tickers, setTickers] = useState<Ticker[] | null>(null);
  const [series, setSeries] = useState<Record<string, number[]>>({});

  useEffect(() => {
    let active = true;

    getTickers()
      .then((all) => {
        if (!active) return;
        const picked = FEATURED.map((symbol) =>
          all.find((t) => t.symbol === symbol)
        ).filter(Boolean) as Ticker[];
        setTickers(picked.length ? picked : all.slice(0, FEATURED.length));
      })
      .catch(() => active && setTickers([]));

    const weekAgo = String(
      Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000)
    );
    // Sparklines are decorative here, so a failure just leaves the card bare.
    FEATURED.forEach((market) => {
      getKlines({ market, interval: "4h", startTime: weekAgo })
        .then((klines) => {
          if (!active) return;
          setSeries((prev) => ({
            ...prev,
            [market]: klines.map((k) => Number(k.close)),
          }));
        })
        .catch(() => {});
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="live-markets" className="mx-auto mt-24 max-w-6xl px-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Live markets
          </h2>
          <p className="mt-2 text-sm text-[var(--nx-text-secondary)]">
            Real prices, streamed straight from the exchange.
          </p>
        </div>
        <Link
          href="/market"
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--nx-accent)] transition-colors hover:text-[var(--nx-accent-hover)]"
        >
          View all
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(tickers ?? Array.from({ length: 4 })).map((entry, i) => {
          const ticker = entry as Ticker | undefined;

          if (!ticker) {
            return (
              <div key={i} className="nx-panel space-y-3 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-8 w-full" />
              </div>
            );
          }

          const [base, quote] = ticker.symbol.split("_");
          return (
            <Link
              key={ticker.symbol}
              href={`/trade/${ticker.symbol}`}
              className="nx-panel group p-4 transition-colors hover:border-[var(--nx-border-strong)] hover:bg-[var(--nx-surface-raised)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {base}
                  <span className="text-[var(--nx-text-tertiary)]">/{quote}</span>
                </span>
                <Change
                  value={Number(ticker.priceChangePercent) * 100}
                  variant="pill"
                />
              </div>

              <div className="nx-num mt-3 text-2xl font-semibold">
                {formatPrice(ticker.lastPrice)}
              </div>

              <div className="mt-3 h-8">
                <Sparkline
                  values={series[ticker.symbol] ?? []}
                  width={220}
                  height={32}
                  className="h-8 w-full"
                />
              </div>

              <div className="nx-label mt-3 border-t border-[var(--nx-border)] pt-2.5">
                24h vol{" "}
                <span className="nx-num text-[var(--nx-text-secondary)]">
                  {formatCompactUsd(ticker.quoteVolume)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
