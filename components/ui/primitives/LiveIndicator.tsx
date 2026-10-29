"use client";

import { useStreamStatus } from "@/app/utils/useStreamStatus";
import { cn } from "@/lib/utils";

const LABEL = {
  open: "Live",
  connecting: "Connecting",
  reconnecting: "Reconnecting",
} as const;

/**
 * Tells the trader whether the numbers on screen are still streaming. A dead
 * socket used to look identical to a quiet market.
 */
export function LiveIndicator({ className }: { className?: string }) {
  const status = useStreamStatus();
  const live = status === "open";

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "nx-label inline-flex items-center gap-1.5 normal-case tracking-normal",
        live ? "text-[var(--nx-up)]" : "text-[var(--nx-warn)]",
        className
      )}
    >
      <span className="relative flex size-1.5" aria-hidden>
        {live && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {LABEL[status]}
    </span>
  );
}
