import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--nx-radius-sm)] bg-[var(--nx-surface-hover)]",
        className
      )}
      {...props}
    />
  );
}
