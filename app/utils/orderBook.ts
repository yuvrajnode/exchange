export type Level = [price: string, size: string];

/**
 * Applies an incremental depth update to one side of the book.
 *
 * The previous implementation walked the existing levels and overwrote sizes
 * where the price already appeared. That silently dropped the two updates
 * that matter most: a brand-new price level, and a level being cleared to
 * zero. The book drifted further from reality the longer it stayed open.
 */
export function applyUpdates(
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

/**
 * Drops the overlapping band from a crossed book.
 *
 * Deltas that arrive between the snapshot being generated upstream and it
 * reaching us are lost, so a level the exchange has already consumed can
 * linger and leave the best bid above the best ask — a negative spread, which
 * cannot happen on a real venue. Any such pair would have matched and left the
 * book, so removing both sides of the overlap is the faithful repair.
 */
export function uncross(
  bids: Level[],
  asks: Level[]
): { bids: Level[]; asks: Level[] } {
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
