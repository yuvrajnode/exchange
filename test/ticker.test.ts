import { describe, expect, it } from "vitest";
import { tickerFromFrame } from "@/app/utils/ticker";

describe("tickerFromFrame", () => {
  it("maps stream fields onto the REST ticker shape", () => {
    expect(
      tickerFromFrame({
        s: "SOL_USDC",
        o: "100",
        c: "110",
        h: "112",
        l: "98",
        v: "5000",
        V: "525000",
        n: 42,
      })
    ).toEqual({
      symbol: "SOL_USDC",
      firstPrice: "100",
      lastPrice: "110",
      high: "112",
      low: "98",
      volume: "5000",
      quoteVolume: "525000",
      trades: "42",
      priceChange: "10",
      priceChangePercent: "0.1",
    });
  });

  it("omits fields the frame did not carry", () => {
    expect(tickerFromFrame({ c: "110" })).toEqual({ lastPrice: "110" });
  });

  it("skips the 24h change when the open is missing or zero", () => {
    expect(tickerFromFrame({ o: "0", c: "1" })).not.toHaveProperty(
      "priceChangePercent"
    );
    expect(tickerFromFrame({ o: "abc", c: "1" })).not.toHaveProperty(
      "priceChangePercent"
    );
  });

  it("computes a falling 24h change", () => {
    expect(tickerFromFrame({ o: "200", c: "150" }).priceChangePercent).toBe(
      "-0.25"
    );
  });
});
