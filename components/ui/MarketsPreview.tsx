"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { getTickers } from "@/app/utils/httpClient";
import type { Ticker } from "@/app/utils/types";
import Reveal from "./Reveal";

const FEATURED = ["SOL_USDC", "BTC_USDC", "ETH_USDC", "JUP_USDC"];

function formatPrice(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n < 1 ? 4 : 2,
  });
}

export default function MarketsPreview() {
  const router = useRouter();
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getTickers()
      .then((all) => {
        if (!active) return;
        const picked = FEATURED.map((s) =>
          all.find((t) => t.symbol === s)
        ).filter(Boolean) as Ticker[];
        setTickers(picked.length ? picked : all.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Live <span className="nx-gradient-text">markets</span>
          </h2>
          <p className="mt-2 text-neutral-400">
            Real prices, streamed straight from the exchange.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/market")}
          className="hidden items-center gap-1 text-sm font-medium text-cyan-300 transition-colors hover:text-cyan-200 sm:flex"
        >
          View all <ArrowUpRight className="h-4 w-4" />
        </button>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(loading ? Array.from({ length: 4 }) : tickers).map((t, i) => {
          const ticker = t as Ticker | undefined;
          const change = Number(ticker?.priceChangePercent ?? 0) * 100;
          const up = change >= 0;
          return (
            <Reveal key={ticker?.symbol ?? i} delay={i * 0.08}>
              <button
                type="button"
                disabled={!ticker}
                onClick={() => ticker && router.push(`/trade/${ticker.symbol}`)}
                className="nx-glass nx-glow-hover w-full rounded-2xl p-5 text-left"
              >
                {ticker ? (
                  <>
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-semibold text-white">
                        {ticker.symbol.replace("_", " / ")}
                      </span>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                          up
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-rose-500/15 text-rose-300"
                        }`}
                      >
                        {up ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {up ? "+" : ""}
                        {change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold tabular-nums text-white">
                      {formatPrice(ticker.lastPrice)}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      24h Vol {Number(ticker.volume).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                    <div className="h-7 w-32 animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  </div>
                )}
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
