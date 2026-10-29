import { describe, expect, it } from "vitest";
import { applyUpdates, uncross, type Level } from "@/app/utils/orderBook";

describe("applyUpdates", () => {
  const bids: Level[] = [
    ["101", "2"],
    ["100", "5"],
  ];

  it("inserts a new level in price order", () => {
    expect(applyUpdates(bids, [["100.5", "1"]], "bid")).toEqual([
      ["101", "2"],
      ["100.5", "1"],
      ["100", "5"],
    ]);
  });

  it("removes a level cleared to zero", () => {
    expect(applyUpdates(bids, [["101", "0"]], "bid")).toEqual([["100", "5"]]);
    expect(applyUpdates(bids, [["101", "0.000"]], "bid")).toEqual([["100", "5"]]);
  });

  it("overwrites the size of an existing level", () => {
    expect(applyUpdates(bids, [["100", "7"]], "bid")).toEqual([
      ["101", "2"],
      ["100", "7"],
    ]);
  });

  it("sorts asks ascending from the best price", () => {
    expect(
      applyUpdates([["102", "1"]], [["101.5", "3"], ["103", "1"]], "ask")
    ).toEqual([
      ["101.5", "3"],
      ["102", "1"],
      ["103", "1"],
    ]);
  });

  it("does not mutate its input", () => {
    const before = structuredClone(bids);
    applyUpdates(bids, [["99", "1"], ["101", "0"]], "bid");
    expect(bids).toEqual(before);
  });
});

describe("uncross", () => {
  it("leaves a healthy book untouched", () => {
    const book = { bids: [["99", "1"]] as Level[], asks: [["100", "1"]] as Level[] };
    expect(uncross(book.bids, book.asks)).toEqual(book);
  });

  it("removes both sides of a crossed band", () => {
    const bids: Level[] = [
      ["101", "1"],
      ["100", "1"],
      ["98", "1"],
    ];
    const asks: Level[] = [
      ["99", "1"],
      ["100.5", "1"],
      ["102", "1"],
    ];

    expect(uncross(bids, asks)).toEqual({
      bids: [["98", "1"]],
      asks: [["102", "1"]],
    });
  });

  it("treats an equal best bid and ask as crossed", () => {
    expect(uncross([["100", "1"]], [["100", "1"]])).toEqual({ bids: [], asks: [] });
  });

  it("passes through a book with an empty side", () => {
    expect(uncross([], [["100", "1"]])).toEqual({ bids: [], asks: [["100", "1"]] });
    expect(uncross([["100", "1"]], [])).toEqual({ bids: [["100", "1"]], asks: [] });
  });
});
