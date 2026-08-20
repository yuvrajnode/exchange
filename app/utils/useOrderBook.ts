"use client";

import { useEffect, useState } from "react";
import { getDepth } from "./httpClient";
import { SignalingManager } from "./SignalingManager";

export type Level = [price: string, size: string];

export type OrderBookState = {
  bids: Level[];
  asks: Level[];
  loading: boolean;
  error: boolean;
};

/**
 * Applies an incremental depth update to one side of the book.
 *
 * The previous implementation walked the existing levels and overwrote sizes
 * where the price already appeared. That silently dropped the two updates
 * that matter most: a brand-new price level, and a level being cleared to
 * zero. The book drifted further from reality the longer it stayed open.
 */
function applyUpdates(
  levels: Level[],
  updates: Level[],
  side: "bid" | "ask"
): Level[] {
  const merged = new Map(levels);

  for (const [price, size] of updates) {
    if (Number(size) === 0) {
      merged.delete(price);
    } else {
      merged.set(price, size);
    }
  }

  // Bids descend from the best (highest) price, asks ascend from the best.
  return [...merged.entries()].sort((a, b) =>
    side === "bid" ? Number(b[0]) - Number(a[0]) : Number(a[0]) - Number(b[0])
  );
}

const RESYNC_MS = 20_000;

const EMPTY_BOOK: OrderBookState = {
  bids: [],
  asks: [],
  loading: true,
  error: false,
};

/**
 * Drops the overlapping band from a crossed book.
 *
 * Deltas that arrive between the snapshot being generated upstream and it
 * reaching us are lost, so a level the exchange has already consumed can
 * linger and leave the best bid above the best ask — a negative spread, which
 * cannot happen on a real venue. Any such pair would have matched and left the
 * book, so removing both sides of the overlap is the faithful repair.
 */
function uncross(bids: Level[], asks: Level[]): { bids: Level[]; asks: Level[] } {
  const bestBid = Number(bids[0]?.[0]);
  const bestAsk = Number(asks[0]?.[0]);

  if (!Number.isFinite(bestBid) || !Number.isFinite(bestAsk) || bestBid < bestAsk) {
    return { bids, asks };
  }

  return {
    bids: bids.filter(([price]) => Number(price) < bestAsk),
    asks: asks.filter(([price]) => Number(price) > bestBid),
  };
}

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
    const key = `DEPTH-${market}`;
    const manager = SignalingManager.getInstance();

    manager.registerCallback(
      "depth",
      (data: unknown) => {
        const update = data as { bids?: Level[]; asks?: Level[] };
        if (!active) return;

        setState((prev) => ({
          ...prev,
          ...uncross(
            applyUpdates(prev.bids, update.bids ?? [], "bid"),
            applyUpdates(prev.asks, update.asks ?? [], "ask")
          ),
        }));
      },
      key
    );

    manager.sendMessage({ method: "SUBSCRIBE", params: [`depth.${market}`] });

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
      manager.sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.${market}`],
      });
      manager.deRegisterCallback("depth", key);
    };
  }, [market]);

  return {
    ...state,
    bids: state.bids.slice(0, depth),
    asks: state.asks.slice(0, depth),
  };
}
