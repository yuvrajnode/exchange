"use client";

import { useEffect, useRef, useState } from "react";

export type PollState<T> = {
  data: T | null;
  error: Error | null;
  /** True only until the first response — refreshes don't blank the UI. */
  loading: boolean;
};

/**
 * Polls an async source on an interval, backing off exponentially while it
 * keeps failing. Without the backoff a dead upstream gets hammered at the
 * happy-path interval for as long as the tab stays open.
 */
export function usePolling<T>(
  fetcher: () => Promise<T>,
  intervalMs: number,
  deps: unknown[] = []
): PollState<T> & { refresh: () => void } {
  const [state, setState] = useState<PollState<T>>({
    data: null,
    error: null,
    loading: true,
  });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let failures = 0;

    const tick = async () => {
      try {
        const data = await fetcherRef.current();
        if (!active) return;
        failures = 0;
        setState({ data, error: null, loading: false });
      } catch (error) {
        if (!active) return;
        failures += 1;
        setState((prev) => ({
          data: prev.data,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        }));
      } finally {
        if (active) {
          // 1x, 2x, 4x … capped at 8x the base interval.
          const delay = intervalMs * Math.min(2 ** failures, 8);
          timer = setTimeout(tick, delay);
        }
      }
    };

    setState((prev) => ({ ...prev, loading: prev.data === null }));
    tick();

    return () => {
      active = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, nonce, ...deps]);

  return { ...state, refresh: () => setNonce((n) => n + 1) };
}
