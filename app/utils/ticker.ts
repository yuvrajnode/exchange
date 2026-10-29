import type { Ticker } from "./types";

/** A `ticker.<symbol>` stream frame. Every field is optional on the wire. */
export type TickerFrame = {
  s?: string;
  o?: string;
  c?: string;
  h?: string;
  l?: string;
  v?: string;
  V?: string;
  n?: number | string;
};

/**
 * Maps a stream frame onto the REST ticker shape, keeping only the fields the
 * frame actually carried so a merge never blanks a stat out.
 *
 * The frame's `o` is the rolling 24h open, so the 24h change is recomputed
 * from it. Without that, the change figure froze at the page-load snapshot
 * while the price beside it kept moving.
 */
export function tickerFromFrame(frame: TickerFrame): Partial<Ticker> {
  const update: Partial<Ticker> = {
    symbol: frame.s,
    firstPrice: frame.o,
    lastPrice: frame.c,
    high: frame.h,
    low: frame.l,
    volume: frame.v,
    quoteVolume: frame.V,
    trades: frame.n === undefined ? undefined : String(frame.n),
  };

  const open = Number(frame.o);
  const last = Number(frame.c);
  if (frame.o !== undefined && frame.c !== undefined && open > 0 && Number.isFinite(last)) {
    update.priceChange = String(last - open);
    update.priceChangePercent = String((last - open) / open);
  }

  return Object.fromEntries(
    Object.entries(update).filter(([, value]) => value !== undefined)
  );
}
