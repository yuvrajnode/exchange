/** Shared number formatting so prices read the same on every screen. */

const USD = (maximumFractionDigits: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits,
  });

/** Sub-dollar assets need more precision than blue chips. */
export function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";
  if (n === 0) return "$0.00";
  if (Math.abs(n) < 0.01) return `$${n.toPrecision(3)}`;
  return USD(Math.abs(n) < 1 ? 4 : 2).format(n);
}

/** Decimal places a quoted number string carries: "147.25" → 2, "0.0000213" → 7. */
export function decimalsOf(value: string): number {
  const dot = value.indexOf(".");
  return dot === -1 ? 0 : value.length - dot - 1;
}

/**
 * Decimal places to show a column of upstream figures at. The exchange quotes
 * each price and size to the market's tick and lot, so the longest one is the
 * right precision. Hard-coding 2 rendered every level of a sub-cent market
 * such as BONK/USDC as "0.00", and every BTC size under 0.005 as "0.00".
 */
export function digitsFor(values: readonly string[], min = 2, max = 8): number {
  let digits = min;
  for (const value of values) digits = Math.max(digits, decimalsOf(value));
  return Math.min(digits, max);
}

/** Bare number, no currency symbol — for order books and size columns. */
export function formatNumber(value: number | string, digits = 2): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** 1.23B / 4.56M / 789.0K */
export function formatCompact(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "—";

  const abs = Math.abs(n);
  const [divisor, suffix] =
    abs >= 1e12 ? [1e12, "T"]
    : abs >= 1e9 ? [1e9, "B"]
    : abs >= 1e6 ? [1e6, "M"]
    : abs >= 1e3 ? [1e3, "K"]
    : [1, ""];

  return `${(n / divisor).toFixed(2)}${suffix}`;
}

export function formatCompactUsd(value: number | string): string {
  const formatted = formatCompact(value);
  return formatted === "—" ? formatted : `$${formatted}`;
}

/** Takes an already-percentage value: 6.99 → "+6.99%". */
export function formatSignedPercent(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", { hour12: false });
}
