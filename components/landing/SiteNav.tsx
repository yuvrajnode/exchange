"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";
import { Logo } from "@/components/ui/primitives/Logo";

const LINKS = [
  { label: "Markets", href: "/market" },
  { label: "Trade", href: "/trade/SOL_USDC" },
  { label: "How it works", href: "#how-it-works" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Border only appears once the page has moved, so the hero starts seamless.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        scrolled
          ? "border-b border-[var(--nx-border)] bg-[var(--nx-bg)]/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Nexus home">
          <Logo className="h-7 w-7" />
          <span className="text-base font-semibold tracking-tight">Nexus</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-[var(--nx-radius-sm)] px-3 py-2 text-sm font-medium text-[var(--nx-text-secondary)] transition-colors hover:text-[var(--nx-text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <Link href="/market">Launch app</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-[var(--nx-radius-sm)] p-2 text-[var(--nx-text-secondary)] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--nx-border)] bg-[var(--nx-bg)] px-5 py-3 md:hidden">
          <nav className="flex flex-col">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--nx-radius-sm)] px-2 py-2.5 text-sm font-medium text-[var(--nx-text-secondary)] hover:bg-[var(--nx-surface-hover)] hover:text-[var(--nx-text)]"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild size="md" block className="mt-3">
              <Link href="/market" onClick={() => setOpen(false)}>
                Launch app
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
