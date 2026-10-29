"use client";

import { useState } from "react";
import { tickDirection, type TickDirection } from "@/lib/tick";

export type Tick = { direction: TickDirection | null; seq: number };

/**
 * Tracks which way a streamed value last moved. `seq` advances on every move,
 * so keying an element on it restarts that element's CSS animation. The first
 * value, and a value appearing after a blank (a market switch), never flash.
 */
export function useTick(value: string | undefined): Tick {
  const [state, setState] = useState<Tick & { value: string | undefined }>({
    value,
    direction: null,
    seq: 0,
  });

  if (value !== state.value) {
    const direction = tickDirection(state.value, value);
    setState({ value, direction, seq: direction ? state.seq + 1 : state.seq });
  }

  return state;
}
