"use client";

import { useEffect, useState } from "react";
import { getTicker } from "./httpClient";
import { SignalingManager } from "./SignalingManager";
import { tickerFromFrame, type TickerFrame } from "./ticker";
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

    getTicker(market)
      .then((result) => {
        if (active && result) setTicker(result);
      })
      .catch(() => {});

    const unsubscribe = SignalingManager.getInstance().subscribe(
      `ticker.${market}`,
      (data) => {
        if (!active) return;
        // Stream frames carry only the fields that changed, so merge rather
        // than replace or the untouched stats blank out.
        const update = tickerFromFrame(data as TickerFrame);
        setTicker((prev) => (prev ? { ...prev, ...update } : null));
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [market]);

  return ticker;
}
