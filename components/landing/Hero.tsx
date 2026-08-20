"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";
import { HeroTerminal } from "./HeroTerminal";
import { getTickers } from "@/app/utils/httpClient";
import { formatCompact, formatCompactUsd } from "@/lib/format";

type Stats = { markets: string; volume: string; trades: string };

export function Hero() {
  const [stats, setStats] = useState<Stats | null>(null);

  // Headline numbers are derived from the live ticker feed rather than
  // hard-coded, so they can't quietly become a lie.
  useEffect(() => {
    let active = true;
    getTickers()
      .then((tickers) => {
        if (!active) return;
        const sum = (key: "quoteVolume" | "trades") =>
          tickers.reduce((total, t) => total + (Number(t[key]) || 0), 0);
        setStats({
          markets: tickers.length.toLocaleString("en-US"),
          volume: formatCompactUsd(sum("quoteVolume")),
          trades: formatCompact(sum("trades")),
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 nx-grid-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--nx-border-strong)] bg-[var(--nx-surface)] px-3 py-1 text-xs font-medium text-[var(--nx-text-secondary)]">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--nx-accent)] opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[var(--nx-accent)]" />
              </span>
              Streaming live market data
            </span>

            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-[var(--nx-text)] sm:text-5xl md:text-6xl">
              A trading terminal
              <br />
              built for{" "}
              <span className="text-[var(--nx-accent)]">speed</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[var(--nx-text-secondary)] md:text-lg">
              Live order books, streaming candlesticks and sub-second ticker
              updates over a single multiplexed WebSocket. No account, no
              sign-up — open a market and start reading the tape.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/trade/SOL_USDC">
                  Start trading
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/market">Browse markets</Link>
              </Button>
            </div>

            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--nx-border)] pt-6">
              <Stat label="Live markets" value={stats?.markets} />
              <Stat label="24h volume" value={stats?.volume} />
              <Stat label="24h trades" value={stats?.trades} />
            </dl>
          </div>

          <HeroTerminal />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dd className="nx-num text-xl font-semibold text-[var(--nx-text)] md:text-2xl">
        {value ?? <span className="text-[var(--nx-text-tertiary)]">—</span>}
      </dd>
      <dt className="nx-label mt-1">{label}</dt>
    </div>
  );
}
