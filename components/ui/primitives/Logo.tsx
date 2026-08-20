import { cn } from "@/lib/utils";

/**
 * Nexus mark: an ascending three-candle series that also reads as an "N".
 * Inline SVG rather than an <img> so it inherits colour and stays crisp at
 * the 20–24px sizes the nav uses.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Nexus"
      className={cn("shrink-0", className)}
    >
      <rect width="32" height="32" rx="8" fill="var(--nx-accent)" />
      {/* Wicks */}
      <g stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.55">
        <line x1="9" y1="18" x2="9" y2="25" />
        <line x1="16" y1="7" x2="16" y2="12" />
        <line x1="16" y1="20" x2="16" y2="25" />
        <line x1="23" y1="7" x2="23" y2="14" />
      </g>
      {/* Bodies, stepping up left to right */}
      <g fill="#fff">
        <rect x="7" y="18" width="4" height="5" rx="1.2" />
        <rect x="14" y="12" width="4" height="8" rx="1.2" />
        <rect x="21" y="8" width="4" height="12" rx="1.2" />
      </g>
    </svg>
  );
}
