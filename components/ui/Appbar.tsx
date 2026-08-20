"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/primitives/Button";
import { Logo } from "@/components/ui/primitives/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Markets", href: "/market", match: "/market" },
  { label: "Trade", href: "/trade/SOL_USDC", match: "/trade" },
];

/**
 * Application chrome for the signed-in surfaces (markets, trade). The landing
 * page has its own marketing nav.
 */
export default function Appbar({ TrueButton }: { TrueButton?: number }) {
  const pathname = usePathname() ?? "";
  const showActions = TrueButton === 1;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--nx-border)] bg-[var(--nx-bg)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-4 px-4 sm:gap-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-[var(--nx-radius-sm)]"
          aria-label="Nexus home"
        >
          <Logo className="h-6 w-6" />
          <span className="text-[15px] font-semibold tracking-tight text-[var(--nx-text)]">
            Nexus
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.match);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-[var(--nx-radius-sm)] px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-[var(--nx-surface-hover)] text-[var(--nx-text)]"
                    : "text-[var(--nx-text-secondary)] hover:text-[var(--nx-text)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {showActions && (
          // Hidden on the narrowest screens: the trade view needs its width
          // for the market bar, and neither button does anything in a demo.
          <div className="ml-auto hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm" disabled title="Demo build — no wallet connected">
              Deposit
            </Button>
            <Button variant="secondary" size="sm" disabled title="Demo build — no wallet connected">
              Withdraw
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
