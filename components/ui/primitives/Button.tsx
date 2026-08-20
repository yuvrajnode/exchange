import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * The single button in the app. `buy` and `sell` are separate variants rather
 * than colour props because order-entry is the one place where the colour is
 * load-bearing and must never drift from the order-book greens and reds.
 */
const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-[background-color,border-color,color,box-shadow,transform]",
    "duration-150 ease-out active:scale-[0.985]",
    "disabled:pointer-events-none disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--nx-accent)] text-white hover:bg-[var(--nx-accent-hover)] shadow-[var(--nx-shadow)]",
        secondary:
          "border border-[var(--nx-border-strong)] bg-[var(--nx-surface-raised)] text-[var(--nx-text)] hover:border-[var(--nx-text-tertiary)] hover:bg-[var(--nx-surface-hover)]",
        outline:
          "border border-[var(--nx-border-strong)] text-[var(--nx-text-secondary)] hover:border-[var(--nx-accent)] hover:text-[var(--nx-text)]",
        ghost:
          "text-[var(--nx-text-secondary)] hover:bg-[var(--nx-surface-hover)] hover:text-[var(--nx-text)]",
        buy: "bg-[var(--nx-up)] text-[#04140d] hover:brightness-110",
        sell: "bg-[var(--nx-down)] text-[#1a0509] hover:brightness-110",
        link: "text-[var(--nx-accent)] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 rounded-[var(--nx-radius-sm)] px-3 text-[13px] [&_svg]:size-3.5",
        md: "h-10 rounded-[var(--nx-radius)] px-4 text-sm [&_svg]:size-4",
        lg: "h-12 rounded-[var(--nx-radius)] px-6 text-[15px] [&_svg]:size-4",
        icon: "size-9 rounded-[var(--nx-radius-sm)] [&_svg]:size-4",
      },
      block: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", block: false },
  }
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element (e.g. a Next.js <Link>). */
    asChild?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      // Slot forwards to whatever child is passed, which may not take `type`.
      {...(asChild ? {} : { type })}
      className={cn(buttonVariants({ variant, size, block }), className)}
      {...props}
    />
  );
}

export { buttonVariants };
