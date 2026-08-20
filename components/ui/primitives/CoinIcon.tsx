"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Coin logo with a deterministic fallback. Third-party logo URLs go missing
 * often enough that a blank circle would be a routine sight; next/image also
 * throws outright on an empty src.
 */
export function CoinIcon({
  src,
  symbol,
  size = 28,
  className,
}: {
  src?: string | null;
  symbol: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  const shared = cn(
    "shrink-0 rounded-full bg-[var(--nx-surface-hover)] object-cover",
    className
  );

  if (!src || failed) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        className={cn(
          shared,
          "inline-flex items-center justify-center font-semibold text-[var(--nx-text-secondary)]"
        )}
      >
        {symbol.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${symbol} logo`}
      width={size}
      height={size}
      className={shared}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
