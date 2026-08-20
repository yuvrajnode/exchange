import * as React from "react";
import { cn } from "@/lib/utils";

/** Flat surface with a hairline border — the app's only container shape. */
export function Panel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("nx-panel", className)} {...props} />;
}

/**
 * Panel header with an optional right-hand slot for filters or actions.
 * Keeps the title/action baseline identical across every pane.
 */
export function PanelHeader({
  title,
  action,
  className,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-[var(--nx-border)] px-4 py-3",
        className
      )}
    >
      <h2 className="text-sm font-semibold text-[var(--nx-text)]">{title}</h2>
      {action}
    </div>
  );
}
