"use client";

import { useCallback, useMemo } from "react";
import { getTrades } from "@/app/utils/httpClient";
import { usePolling } from "@/app/utils/usePolling";
import { Skeleton } from "@/components/ui/skeleton";
import { digitsFor, formatNumber, formatTime } from "@/lib/format";

export function TradeTape({ market }: { market: string }) {
  const load = useCallback(
    () => getTrades(market, 40).then((trades) => trades.slice().reverse()),
    [market]
  );
  const { data, error, loading } = usePolling(load, 4000, [market]);
  const trades = useMemo(() => data ?? [], [data]);
  const digits = useMemo(
    () => ({
      price: digitsFor(trades.map((t) => t.price)),
      size: digitsFor(trades.map((t) => t.quantity), 2, 6),
    }),
    [trades]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[var(--nx-border)] px-3 py-2.5">
        <h2 className="text-sm font-semibold">Recent trades</h2>
      </div>

      <div className="nx-label grid grid-cols-3 px-3 py-1.5">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Time</span>
      </div>

      <div className="nx-scroll min-h-0 flex-1 overflow-y-auto">
        {loading && trades.length === 0 ? (
          <div className="space-y-1.5 px-3 py-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-full" />
            ))}
          </div>
        ) : trades.length === 0 ? (
          <p className="px-3 py-8 text-center text-xs text-[var(--nx-text-secondary)]">
            {error ? "Trade feed unavailable — retrying…" : "No recent trades."}
          </p>
        ) : (
          trades.map((trade) => {
            // isBuyerMaker means the resting order was a bid, so the taker sold.
            const buy = !trade.isBuyerMaker;
            return (
              <div
                key={trade.id}
                className="grid grid-cols-3 px-3 py-[3px] transition-colors hover:bg-[var(--nx-surface-hover)]"
              >
                <span
                  className={`nx-num text-xs ${
                    buy ? "text-[var(--nx-up)]" : "text-[var(--nx-down)]"
                  }`}
                >
                  {formatNumber(trade.price, digits.price)}
                </span>
                <span className="nx-num text-right text-xs text-[var(--nx-text)]">
                  {formatNumber(trade.quantity, digits.size)}
                </span>
                <span className="nx-num text-right text-xs text-[var(--nx-text-tertiary)]">
                  {formatTime(trade.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
