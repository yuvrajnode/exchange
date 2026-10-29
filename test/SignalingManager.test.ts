import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignalingManager } from "@/app/utils/SignalingManager";

/** Minimal stand-in for the browser WebSocket, driven by the test. */
class FakeSocket {
  static OPEN = 1;
  static instances: FakeSocket[] = [];

  readyState = 0;
  sent: { method: string; params: string[] }[] = [];
  onopen: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onclose: (() => void) | null = null;

  constructor(public url: string) {
    FakeSocket.instances.push(this);
  }

  send(payload: string) {
    this.sent.push(JSON.parse(payload));
  }

  open() {
    this.readyState = FakeSocket.OPEN;
    this.onopen?.();
  }

  emit(message: unknown) {
    this.onmessage?.({ data: JSON.stringify(message) });
  }

  drop() {
    this.readyState = 3;
    this.onclose?.();
  }
}

const latest = () => FakeSocket.instances.at(-1)!;

const depthFrame = (symbol: string) => ({
  stream: `depth.${symbol}`,
  data: { e: "depth", s: symbol, b: [["1", "1"]], a: [] },
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("WebSocket", FakeSocket);
  FakeSocket.instances = [];
  // Each test gets its own singleton.
  (SignalingManager as unknown as { instance: null }).instance = null;
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("SignalingManager", () => {
  it("delivers a frame only to listeners of its stream", () => {
    const manager = SignalingManager.getInstance();
    const sol = vi.fn();
    const eth = vi.fn();
    manager.subscribe("depth.SOL_USDC", sol);
    manager.subscribe("depth.ETH_USDC", eth);
    latest().open();

    latest().emit(depthFrame("SOL_USDC"));

    expect(sol).toHaveBeenCalledTimes(1);
    expect(eth).not.toHaveBeenCalled();
  });

  it("drops frames for a market that was just left", () => {
    const manager = SignalingManager.getInstance();
    latest().open();
    const book = vi.fn();

    manager.subscribe("depth.SOL_USDC", vi.fn())();
    manager.subscribe("depth.ETH_USDC", book);
    // Still in flight when the switch happened.
    latest().emit(depthFrame("SOL_USDC"));

    expect(book).not.toHaveBeenCalled();
  });

  it("falls back to the event type and symbol when a frame has no stream", () => {
    const manager = SignalingManager.getInstance();
    const listener = vi.fn();
    manager.subscribe("ticker.SOL_USDC", listener);
    latest().open();

    latest().emit({ data: { e: "ticker", s: "SOL_USDC", c: "150" } });

    expect(listener).toHaveBeenCalledWith({ e: "ticker", s: "SOL_USDC", c: "150" });
  });

  it("ignores acks, malformed frames and unknown streams", () => {
    const manager = SignalingManager.getInstance();
    const listener = vi.fn();
    manager.subscribe("depth.SOL_USDC", listener);
    latest().open();

    latest().emit({ id: 1, result: null });
    latest().onmessage?.({ data: "not json" });
    latest().emit({ data: { e: "depth" } });
    latest().emit(depthFrame("BTC_USDC"));

    expect(listener).not.toHaveBeenCalled();
  });

  it("shares one upstream subscription between listeners", () => {
    const manager = SignalingManager.getInstance();
    latest().open();

    const first = manager.subscribe("ticker.SOL_USDC", vi.fn());
    const second = manager.subscribe("ticker.SOL_USDC", vi.fn());
    first();

    expect(latest().sent).toEqual([
      { method: "SUBSCRIBE", params: ["ticker.SOL_USDC"], id: 1 },
    ]);

    second();
    expect(latest().sent.at(-1)).toMatchObject({
      method: "UNSUBSCRIBE",
      params: ["ticker.SOL_USDC"],
    });
  });

  it("treats a repeated unsubscribe as a no-op", () => {
    const manager = SignalingManager.getInstance();
    latest().open();

    const stale = manager.subscribe("depth.SOL_USDC", vi.fn());
    stale();
    manager.subscribe("depth.SOL_USDC", vi.fn());
    stale();

    expect(latest().sent.map((m) => m.method)).toEqual([
      "SUBSCRIBE",
      "UNSUBSCRIBE",
      "SUBSCRIBE",
    ]);
  });

  it("subscribes on open to streams requested while connecting", () => {
    const manager = SignalingManager.getInstance();
    manager.subscribe("depth.SOL_USDC", vi.fn());
    manager.subscribe("ticker.SOL_USDC", vi.fn());
    manager.subscribe("ticker.ETH_USDC", vi.fn())();

    expect(latest().sent).toEqual([]);
    latest().open();

    expect(latest().sent).toEqual([
      { method: "SUBSCRIBE", params: ["depth.SOL_USDC", "ticker.SOL_USDC"], id: 1 },
    ]);
  });

  it("reconnects with backoff and resubscribes live streams", () => {
    const manager = SignalingManager.getInstance();
    const listener = vi.fn();
    manager.subscribe("depth.SOL_USDC", listener);
    latest().open();

    latest().drop();
    expect(manager.getStatus()).toBe("reconnecting");

    vi.advanceTimersByTime(999);
    expect(FakeSocket.instances).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(FakeSocket.instances).toHaveLength(2);

    // A failed attempt doubles the wait.
    latest().drop();
    vi.advanceTimersByTime(1999);
    expect(FakeSocket.instances).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(FakeSocket.instances).toHaveLength(3);

    latest().open();
    expect(manager.getStatus()).toBe("open");
    expect(latest().sent).toEqual([
      { method: "SUBSCRIBE", params: ["depth.SOL_USDC"], id: 2 },
    ]);

    latest().emit(depthFrame("SOL_USDC"));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("caps the reconnect delay", () => {
    SignalingManager.getInstance();
    for (let i = 0; i < 10; i++) {
      latest().drop();
      vi.advanceTimersByTime(15_000);
    }
    expect(FakeSocket.instances).toHaveLength(11);
  });

  it("notifies status listeners only on a change", () => {
    const manager = SignalingManager.getInstance();
    const onChange = vi.fn();
    const stop = manager.onStatusChange(onChange);

    expect(manager.getStatus()).toBe("connecting");
    latest().open();
    latest().onopen?.();
    expect(onChange).toHaveBeenCalledTimes(1);

    stop();
    latest().drop();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
