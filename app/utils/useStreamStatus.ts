"use client";

import { useSyncExternalStore } from "react";
import { SignalingManager, type StreamStatus } from "./SignalingManager";

const subscribe = (onChange: () => void) =>
  SignalingManager.getInstance().onStatusChange(onChange);
const getSnapshot = () => SignalingManager.getInstance().getStatus();
// The socket only exists in the browser; the server render shows "connecting".
const getServerSnapshot = (): StreamStatus => "connecting";

/** Live state of the shared market-data socket. */
export function useStreamStatus(): StreamStatus {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
