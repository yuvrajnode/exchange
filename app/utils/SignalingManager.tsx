import { BACKPACK_WS_URL } from "@/lib/config";

type Listener = (data: unknown) => void;

export type StreamStatus = "connecting" | "open" | "reconnecting";

/** Reconnect backoff: 1s, 2s, 4s … capped here. */
const MAX_RETRY_MS = 15_000;

/**
 * One WebSocket for the whole app, multiplexing every stream a mounted panel
 * asks for.
 *
 * Listeners are keyed by stream name ("depth.SOL_USDC"), not by event type.
 * Keying by type alone handed every depth frame to every depth listener, so
 * frames still in flight for the market just left were merged into the new
 * market's book after a switch.
 *
 * Subscriptions are reference counted: two panels on one stream share a single
 * upstream subscription, and one unmounting doesn't cut the other off. A
 * dropped socket reconnects with backoff and re-subscribes to every stream
 * that still has a listener, instead of going silent until a reload.
 */
export class SignalingManager {
  private static instance: SignalingManager | null = null;

  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<Listener>>();
  private nextId = 1;
  private retries = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private status: StreamStatus = "connecting";
  private statusListeners = new Set<() => void>();

  private constructor(private readonly url: string) {
    this.connect();
  }

  public static getInstance(): SignalingManager {
    if (!this.instance) {
      this.instance = new SignalingManager(BACKPACK_WS_URL);
    }
    return this.instance;
  }

  /** Listen to a stream. Returns the matching unsubscribe. */
  public subscribe(stream: string, listener: Listener): () => void {
    let streamListeners = this.listeners.get(stream);
    if (!streamListeners) {
      streamListeners = new Set();
      this.listeners.set(stream, streamListeners);
      this.send("SUBSCRIBE", [stream]);
    }
    streamListeners.add(listener);

    return () => {
      const current = this.listeners.get(stream);
      // A second call, or a call after the stream was torn down and
      // re-created by someone else, must not touch the new subscription.
      if (!current?.delete(listener) || current.size > 0) return;
      this.listeners.delete(stream);
      this.send("UNSUBSCRIBE", [stream]);
    };
  }

  public getStatus(): StreamStatus {
    return this.status;
  }

  public onStatusChange(listener: () => void): () => void {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private connect() {
    const ws = new WebSocket(this.url);
    this.ws = ws;

    ws.onopen = () => {
      this.retries = 0;
      this.setStatus("open");
      // Covers the first connection and every reconnect alike: whatever is
      // being listened to right now is what the server should be sending.
      const streams = [...this.listeners.keys()];
      if (streams.length) this.send("SUBSCRIBE", streams);
    };

    ws.onmessage = (event) => {
      let message: { stream?: string; data?: { e?: string; s?: string } };
      try {
        message = JSON.parse(event.data);
      } catch {
        return;
      }

      // Subscribe acks and error frames carry no payload.
      const data = message?.data;
      if (!data) return;

      const stream =
        message.stream ?? (data.e && data.s ? `${data.e}.${data.s}` : null);
      if (!stream) return;

      this.listeners.get(stream)?.forEach((listener) => listener(data));
    };

    // `onerror` is always followed by `onclose`, which owns the retry.
    ws.onclose = () => {
      if (this.ws !== ws) return;
      this.ws = null;
      this.setStatus("reconnecting");
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(1000 * 2 ** this.retries, MAX_RETRY_MS);
    this.retries += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private send(method: "SUBSCRIBE" | "UNSUBSCRIBE", params: string[]) {
    // Nothing to queue while the socket isn't open: `onopen` subscribes to
    // everything in `listeners`, which already reflects this change.
    if (this.ws?.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({ method, params, id: this.nextId++ }));
  }

  private setStatus(status: StreamStatus) {
    if (status === this.status) return;
    this.status = status;
    this.statusListeners.forEach((listener) => listener());
  }
}
