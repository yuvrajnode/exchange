export type TickDirection = "up" | "down";

/** Which way a streamed figure moved, or null if it didn't or isn't a number. */
export function tickDirection(
  previous: string | undefined,
  next: string | undefined
): TickDirection | null {
  if (previous === undefined || next === undefined) return null;
  const a = Number(previous);
  const b = Number(next);
  if (!Number.isFinite(a) || !Number.isFinite(b) || a === b) return null;
  return b > a ? "up" : "down";
}
