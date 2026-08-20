"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getDepth, getKlines, getTickers } from "@/app/utils/httpClient";
import type { Ticker } from "@/app/utils/types";
import { Sparkline } from "@/components/ui/primitives/Sparkline";
import { Change } from "@/components/ui/primitives/Change";
import { formatNumber, formatPrice } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

const MARKET = "SOL_USDC";
const BOOK_ROWS = 6;

type Book = { bids: [string, string][]; asks: [string, string][] };

/**
 * The hero visual is the product itself, wired to the same live feeds as the
 * trade page, rather than a stock illustration or a hand-drawn fake chart. It
 * degrades to a skeleton if the feeds are unavailable — never to a blank box.
 */
export function HeroTerminal() {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [series, setSeries] = useState<number[]>([]);
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    let active = true;
    const weekAgo = String(
      Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000)
    );

    getTickers()
      .then((all) => {
        if (active) setTicker(all.find((t) => t.symbol === MARKET) ?? null);
      })
      .catch(() => {});

    getKlines({ market: MARKET, interval: "1h", startTime: weekAgo })
      .then((klines) => {
        if (active) setSeries(klines.map((k) => Number(k.close)));
      })
      .catch(() => {});

    getDepth(MARKET)
      .then((d) => {
        if (active) setBook(d);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const change = ticker ? Number(ticker.priceChangePercent) * 100 : NaN;

  const rows = useMemo(() => {
    if (!book) return null;
    return {
      asks: book.asks.slice(0, BOOK_ROWS).reverse(),
      bids: book.bids.slice(-BOOK_ROWS).reverse(),
    };
  }, [book]);

  return (
    <div className="nx-panel overflow-hidden shadow-[var(--nx-shadow-lg)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[var(--nx-border)] bg-[var(--nx-surface-raised)] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="nx-num ml-3 text-xs text-[var(--nx-text-tertiary)]">
          nexus · SOL/USDC · spot
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] font-medium text-[var(--nx-up)]">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--nx-up)] opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[var(--nx-up)]" />
          </span>
          LIVE
        </span>
      </div>

      <div className="grid gap-px bg-[var(--nx-border)] sm:grid-cols-[1.6fr_1fr]">
        {/* Price + chart */}
        <div className="bg-[var(--nx-surface)] p-4 sm:p-5">
          <div className="flex items-baseline gap-3">
            {ticker ? (
              <>
                <span className="nx-num text-3xl font-semibold text-[var(--nx-text)]">
                  {formatPrice(ticker.lastPrice)}
                </span>
                <Change value={change} variant="pill" />
              </>
            ) : (
              <>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </>
            )}
          </div>
          <p className="nx-label mt-1">Solana · 7-day close</p>

          <div className="mt-4 h-28">
            {series.length > 1 ? (
              <Sparkline
                values={series}
                width={400}
                height={112}
                strokeWidth={2}
                className="h-28 w-full"
              />
            ) : (
              <Skeleton className="h-28 w-full" />
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--nx-border)] pt-3">
            <MiniStat label="24h High" value={ticker?.high} />
            <MiniStat label="24h Low" value={ticker?.low} />
            <MiniStat label="24h Trades" value={ticker?.trades} plain />
          </div>
        </div>

        {/* Order book */}
        <div className="bg-[var(--nx-surface)] p-4 sm:p-5">
          <div className="nx-label mb-2 flex justify-between">
            <span>Price</span>
            <span>Size</span>
          </div>

          {rows ? (
            <div className="space-y-px">
              {rows.asks.map(([price, size]) => (
                <BookRow key={`a${price}`} price={price} size={size} side="ask" />
              ))}
              <div className="nx-num py-1.5 text-center text-sm font-semibold text-[var(--nx-text)]">
                {ticker ? formatPrice(ticker.lastPrice) : "—"}
              </div>
              {rows.bids.map(([price, size]) => (
                <BookRow key={`b${price}`} price={price} size={size} side="bid" />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5">
              {Array.from({ length: BOOK_ROWS * 2 + 1 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          )}

          <Link
            href={`/trade/${MARKET}`}
            className="mt-4 block rounded-[var(--nx-radius-sm)] border border-[var(--nx-border-strong)] py-2 text-center text-xs font-medium text-[var(--nx-text-secondary)] transition-colors hover:border-[var(--nx-accent)] hover:text-[var(--nx-text)]"
          >
            Open full order book
          </Link>
        </div>
      </div>
    </div>
  );
}

function BookRow({
  price,
  size,
  side,
}: {
  price: string;
  size: string;
  side: "ask" | "bid";
}) {
  return (
    <div className="nx-num flex justify-between text-xs">
      <span className={side === "ask" ? "text-[var(--nx-down)]" : "text-[var(--nx-up)]"}>
        {formatNumber(price, 2)}
      </span>
      <span className="text-[var(--nx-text-secondary)]">
        {formatNumber(size, 2)}
      </span>
    </div>
  );
}

function MiniStat({
  label,
  value,
  plain,
}: {
  label: string;
  value?: string;
  plain?: boolean;
}) {
  return (
    <div>
      <div className="nx-label">{label}</div>
      {value ? (
        <div className="nx-num mt-0.5 text-sm text-[var(--nx-text)]">
          {plain ? Number(value).toLocaleString("en-US") : formatPrice(value)}
        </div>
      ) : (
        <Skeleton className="mt-1 h-4 w-16" />
      )}
    </div>
  );
}
