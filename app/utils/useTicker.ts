"use client";

import { useEffect, useState } from "react";
import { getTicker } from "./httpClient";
import { SignalingManager } from "./SignalingManager";
import type { Ticker } from "./types";

/**
 * REST snapshot seeded once, then patched by the ticker stream. Lives in a
 * hook so the market bar and the order form read the same price rather than
 * each opening their own subscription.
 */
export function useTicker(market: string): Ticker | null {
  const [ticker, setTicker] = useState<Ticker | null>(null);

  // Clear the previous market's prices in the same render that the market
  // changes, so no frame shows one market's symbol beside another's price.
  const [renderedMarket, setRenderedMarket] = useState(market);
  if (renderedMarket !== market) {
    setRenderedMarket(market);
    setTicker(null);
  }

  useEffect(() => {
    let active = true;
    const key = `TICKER-${market}`;
    const manager = SignalingManager.getInstance();

    getTicker(market)
      .then((result) => {
        if (active && result) setTicker(result);
      })
      .catch(() => {});

    manager.registerCallback(
      "ticker",
      (data: unknown) => {
        if (!active) return;
        const update = data as Partial<Ticker>;
        // Stream frames carry only the fields that changed, so merge rather
        // than replace or the untouched stats blank out.
        setTicker((prev) =>
          prev ? { ...prev, ...stripUndefined(update) } : null
        );
      },
      key
    );

    manager.sendMessage({ method: "SUBSCRIBE", params: [`ticker.${market}`] });

    return () => {
      active = false;
      manager.sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${market}`],
      });
      manager.deRegisterCallback("ticker", key);
    };
  }, [market]);

  return ticker;
}

function stripUndefined(update: Partial<Ticker>): Partial<Ticker> {
  return Object.fromEntries(
    Object.entries(update).filter(([, value]) => value !== undefined)
  );
}
