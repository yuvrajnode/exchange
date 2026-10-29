import { describe, expect, it } from "vitest";
import { tickDirection } from "@/lib/tick";

describe("tickDirection", () => {
  it("reports the direction of a move", () => {
    expect(tickDirection("100", "100.5")).toBe("up");
    expect(tickDirection("100", "99.99")).toBe("down");
  });

  it("compares numerically, not as strings", () => {
    expect(tickDirection("9.5", "10")).toBe("up");
    expect(tickDirection("100.10", "100.1")).toBeNull();
  });

  it("stays quiet without a previous value", () => {
    // First paint and the frame after a market switch must not flash.
    expect(tickDirection(undefined, "100")).toBeNull();
    expect(tickDirection("100", undefined)).toBeNull();
  });

  it("ignores values that aren't numbers", () => {
    expect(tickDirection("abc", "100")).toBeNull();
    expect(tickDirection("100", "NaN")).toBeNull();
  });
});
