"use client";

import { useEffect, useState } from "react";
import { getDepth } from "./httpClient";
import { applyUpdates, uncross, type Level } from "./orderBook";
import { SignalingManager } from "./SignalingManager";

export type { Level };

export type OrderBookState = {
  bids: Level[];
  asks: Level[];
  loading: boolean;
  error: boolean;
};

const RESYNC_MS = 20_000;

const EMPTY_BOOK: OrderBookState = {
  bids: [],
  asks: [],
  loading: true,
  error: false,
};

export function useOrderBook(market: string, depth = 15): OrderBookState {
  const [state, setState] = useState<OrderBookState>(EMPTY_BOOK);

  // Switching markets must clear the previous book, not show it under the new
  // market's header while the snapshot loads. Adjusting during render rather
  // than in an effect avoids a frame of stale prices.
  const [renderedMarket, setRenderedMarket] = useState(market);
  if (renderedMarket !== market) {
    setRenderedMarket(market);
    setState(EMPTY_BOOK);
  }

  useEffect(() => {
    let active = true;

    const unsubscribe = SignalingManager.getInstance().subscribe(
      `depth.${market}`,
      (data) => {
        if (!active) return;
        const frame = data as { b?: Level[]; a?: Level[] };

        setState((prev) => ({
          ...prev,
          ...uncross(
            applyUpdates(prev.bids, frame.b ?? [], "bid"),
            applyUpdates(prev.asks, frame.a ?? [], "ask")
          ),
        }));
      }
    );

    const snapshot = () =>
      getDepth(market)
        .then((book) => {
          if (!active) return;
          setState({
            // The REST snapshot arrives ascending on both sides.
            bids: [...book.bids].sort((a, b) => Number(b[0]) - Number(a[0])),
            asks: [...book.asks].sort((a, b) => Number(a[0]) - Number(b[0])),
            loading: false,
            error: false,
          });
        })
        .catch(() => {
          if (active) {
            setState((prev) => ({ ...prev, loading: false, error: true }));
          }
        });

    snapshot();
    // Deltas alone drift over a long session; re-seeding keeps the book honest.
    const resync = setInterval(snapshot, RESYNC_MS);

    return () => {
      active = false;
      clearInterval(resync);
      unsubscribe();
    };
  }, [market]);

  return {
    ...state,
    bids: state.bids.slice(0, depth),
    asks: state.asks.slice(0, depth),
  };
}
