import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSignedPercent } from "@/lib/format";

/**
 * A signed 24h move. Colour alone can't carry the sign for colour-blind
 * users, so the arrow and the explicit +/- always travel with it.
 */
export function Change({
  value,
  variant = "text",
  className,
}: {
  /** Already a percentage: 6.99 means +6.99%. */
  value: number;
  variant?: "text" | "pill";
  className?: string;
}) {
  if (!Number.isFinite(value)) {
    return <span className={cn("nx-num text-[var(--nx-text-tertiary)]", className)}>—</span>;
  }

  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  if (variant === "pill") {
    return (
      <span
        className={cn(
          "nx-num inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
          up
            ? "bg-[var(--nx-up-soft)] text-[var(--nx-up)]"
            : "bg-[var(--nx-down-soft)] text-[var(--nx-down)]",
          className
        )}
      >
        <Icon className="size-3" aria-hidden />
        {formatSignedPercent(value)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "nx-num inline-flex items-center gap-0.5 text-sm font-medium",
        up ? "text-[var(--nx-up)]" : "text-[var(--nx-down)]",
        className
      )}
    >
      <Icon className="size-3.5" aria-hidden />
      {formatSignedPercent(value)}
    </span>
  );
}
