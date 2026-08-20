"use client";

import { useMemo } from "react";
import { useOrderBook, type Level } from "@/app/utils/useOrderBook";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber } from "@/lib/format";

const ROWS = 12;

type Row = { price: string; size: string; total: number };

/** Running cumulative size, walking outward from the best price. */
function withTotals(levels: Level[]): Row[] {
  let running = 0;
  return levels.map(([price, size]) => {
    running += Number(size);
    return { price, size, total: running };
  });
}

export function OrderBook({
  market,
  onSelectPrice,
}: {
  market: string;
  /** Clicking a level pre-fills the order form, as on a real venue. */
  onSelectPrice?: (price: string) => void;
}) {
  const { bids, asks, loading, error } = useOrderBook(market, ROWS);

  const { bidRows, askRows, maxTotal, spread, spreadPct, mid } = useMemo(() => {
    const bidRows = withTotals(bids);
    const askRows = withTotals(asks);
    const bestBid = Number(bids[0]?.[0]);
    const bestAsk = Number(asks[0]?.[0]);
    const haveBoth = Number.isFinite(bestBid) && Number.isFinite(bestAsk);

    return {
      bidRows,
      askRows,
      // One shared scale so the two sides are visually comparable.
      maxTotal: Math.max(
        bidRows.at(-1)?.total ?? 0,
        askRows.at(-1)?.total ?? 0,
        1
      ),
      spread: haveBoth ? bestAsk - bestBid : null,
      spreadPct: haveBoth ? ((bestAsk - bestBid) / bestAsk) * 100 : null,
      mid: haveBoth ? (bestAsk + bestBid) / 2 : null,
    };
  }, [bids, asks]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[var(--nx-border)] px-3 py-2.5">
        <h2 className="text-sm font-semibold">Order book</h2>
      </div>

      <div className="nx-label grid grid-cols-3 px-3 py-1.5">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {error ? (
        <p className="px-3 py-8 text-center text-xs text-[var(--nx-text-secondary)]">
          Order book unavailable.
        </p>
      ) : loading ? (
        <div className="space-y-1.5 px-3 py-2">
          {Array.from({ length: ROWS * 2 }).map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-full" />
          ))}
        </div>
      ) : (
        <div className="nx-scroll flex min-h-0 flex-1 flex-col justify-center overflow-y-auto">
          {/* Asks, best price nearest the spread. */}
          <div className="flex flex-col-reverse">
            {askRows.map((row) => (
              <BookRow
                key={`a${row.price}`}
                row={row}
                maxTotal={maxTotal}
                side="ask"
                onSelect={onSelectPrice}
              />
            ))}
          </div>

          <div className="my-1 flex items-baseline justify-between border-y border-[var(--nx-border)] px-3 py-2">
            <span className="nx-num text-base font-semibold text-[var(--nx-text)]">
              {mid !== null ? formatNumber(mid, 2) : "—"}
            </span>
            <span className="nx-num text-[11px] text-[var(--nx-text-tertiary)]">
              {spread !== null && spreadPct !== null
                ? `${formatNumber(spread, 2)} (${spreadPct.toFixed(3)}%)`
                : "—"}
            </span>
          </div>

          <div>
            {bidRows.map((row) => (
              <BookRow
                key={`b${row.price}`}
                row={row}
                maxTotal={maxTotal}
                side="bid"
                onSelect={onSelectPrice}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookRow({
  row,
  maxTotal,
  side,
  onSelect,
}: {
  row: Row;
  maxTotal: number;
  side: "bid" | "ask";
  onSelect?: (price: string) => void;
}) {
  const width = Math.min(100, (row.total / maxTotal) * 100);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(row.price)}
      title={`${side === "bid" ? "Bid" : "Ask"} ${row.price}`}
      className="relative grid w-full grid-cols-3 px-3 py-[3px] text-left transition-colors hover:bg-[var(--nx-surface-hover)]"
    >
      {/* Depth bar grows from the right so the shape reads as a wall
          building away from the spread. */}
      <span
        aria-hidden
        style={{ width: `${width}%` }}
        className={`absolute inset-y-0 right-0 ${
          side === "bid" ? "bg-[var(--nx-up-soft)]" : "bg-[var(--nx-down-soft)]"
        }`}
      />
      <span
        className={`nx-num relative text-xs ${
          side === "bid" ? "text-[var(--nx-up)]" : "text-[var(--nx-down)]"
        }`}
      >
        {formatNumber(row.price, 2)}
      </span>
      <span className="nx-num relative text-right text-xs text-[var(--nx-text)]">
        {formatNumber(row.size, 2)}
      </span>
      <span className="nx-num relative text-right text-xs text-[var(--nx-text-secondary)]">
        {formatNumber(row.total, 2)}
      </span>
    </button>
  );
}
