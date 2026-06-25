"use client";

import { useEffect, useState } from "react";
import { getTrades } from "@/app/utils/httpClient";
import type { Trade } from "@/app/utils/types";

export function RecentTrades({ market }: { market: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    let active = true;
    const load = () =>
      getTrades(market, 30)
        .then((t) => active && setTrades(t.slice().reverse()))
        .catch(() => {});
    load();
    const id = setInterval(load, 4000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [market]);

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
          <div className="py-6 text-center text-xs text-neutral-600">
            Loading trades…
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
