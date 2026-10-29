import { describe, expect, it } from "vitest";
import {
  decimalsOf,
  digitsFor,
  formatCompact,
  formatNumber,
  formatPrice,
  formatSignedPercent,
} from "@/lib/format";

describe("decimalsOf", () => {
  it("counts the places after the point", () => {
    expect(decimalsOf("147.25")).toBe(2);
    expect(decimalsOf("0.0000213")).toBe(7);
    expect(decimalsOf("95000")).toBe(0);
    expect(decimalsOf("")).toBe(0);
  });
});

describe("digitsFor", () => {
  it("uses the longest quote in the column", () => {
    expect(digitsFor(["147.2", "147.25", "147.3"])).toBe(2);
    expect(digitsFor(["0.00002135", "0.0000214"])).toBe(8);
  });

  it("never drops below the minimum", () => {
    expect(digitsFor(["95000", "95001.5"])).toBe(2);
    expect(digitsFor([])).toBe(2);
  });

  it("clamps to the maximum", () => {
    expect(digitsFor(["0.123456789012"])).toBe(8);
    expect(digitsFor(["0.00012345"], 2, 6)).toBe(6);
  });

  it("keeps sub-cent levels distinguishable", () => {
    const levels = ["0.00002131", "0.00002132"];
    const digits = digitsFor(levels);
    const rendered = levels.map((p) => formatNumber(p, digits));
    expect(new Set(rendered).size).toBe(2);
    // The old fixed precision collapsed both to the same string.
    expect(new Set(levels.map((p) => formatNumber(p, 2))).size).toBe(1);
  });
});

describe("formatNumber", () => {
  it("pads to the requested places", () => {
    expect(formatNumber("1234.5", 2)).toBe("1,234.50");
    expect(formatNumber(0.0000213, 7)).toBe("0.0000213");
  });

  it("renders a dash for non-numbers", () => {
    expect(formatNumber("abc")).toBe("—");
  });
});

describe("formatPrice", () => {
  it("scales precision to the price", () => {
    expect(formatPrice(147.256)).toBe("$147.26");
    expect(formatPrice("0.5")).toBe("$0.50");
    expect(formatPrice("0.51237")).toBe("$0.5124");
    expect(formatPrice(0.0000213)).toBe("$0.0000213");
    expect(formatPrice(0)).toBe("$0.00");
    expect(formatPrice("x")).toBe("—");
  });
});

describe("formatCompact", () => {
  it("abbreviates large figures", () => {
    expect(formatCompact(1_234_000_000)).toBe("1.23B");
    expect(formatCompact(4_560_000)).toBe("4.56M");
    expect(formatCompact(999)).toBe("999.00");
  });
});

describe("formatSignedPercent", () => {
  it("signs positive changes", () => {
    expect(formatSignedPercent(6.99)).toBe("+6.99%");
    expect(formatSignedPercent(-1.5)).toBe("-1.50%");
    expect(formatSignedPercent(NaN)).toBe("—");
  });
});
