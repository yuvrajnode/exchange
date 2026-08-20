"use client";

import { useCallback } from "react";
import { getTrades } from "@/app/utils/httpClient";
import { usePolling } from "@/app/utils/usePolling";

export function RecentTrades({ market }: { market: string }) {
  const load = useCallback(
    () => getTrades(market, 30).then((t) => t.slice().reverse()),
    [market]
  );
  const { data, error, loading } = usePolling(load, 4000, [market]);
  const trades = data ?? [];

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 text-sm font-semibold text-white">Recent Trades</div>
      <div className="mb-1 flex justify-between border-b border-white/10 pb-1 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
        <span>Price</span>
        <span>Size</span>
        <span>Time</span>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {trades.length === 0 ? (
          <div className="py-6 text-center text-xs text-neutral-500">
            {loading
              ? "Loading trades…"
              : error
                ? "Trade feed unavailable — retrying…"
                : "No recent trades."}
          </div>
        ) : (
          trades.map((t) => {
            const buy = !t.isBuyerMaker;
            return (
              <div
                key={t.id}
                className="flex justify-between py-0.5 text-xs tabular-nums"
              >
                <span className={buy ? "text-emerald-400" : "text-rose-400"}>
                  {Number(t.price).toLocaleString("en-US", {
                    maximumFractionDigits: 4,
                  })}
                </span>
                <span className="text-neutral-300">
                  {Number(t.quantity).toFixed(2)}
                </span>
                <span className="text-neutral-500">
                  {new Date(t.timestamp).toLocaleTimeString("en-US", {
                    hour12: false,
                  })}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
