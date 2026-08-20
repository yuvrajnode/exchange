import Link from "next/link";
import { Github } from "lucide-react";
import { Logo } from "@/components/ui/primitives/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Markets", href: "/market" },
      { label: "Trade SOL/USDC", href: "/trade/SOL_USDC" },
      { label: "Trade BTC/USDC", href: "/trade/BTC_USDC" },
    ],
  },
  {
    title: "Learn",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Live markets", href: "#live-markets" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-28 border-t border-[var(--nx-border)]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-7 w-7" />
              <span className="text-base font-semibold tracking-tight">Nexus</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--nx-text-secondary)]">
              A real-time crypto trading terminal. Market data is streamed live
              from the Backpack Exchange public API.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="nx-label">{column.title}</h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--nx-text-secondary)] transition-colors hover:text-[var(--nx-text)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--nx-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--nx-text-tertiary)]">
            © {new Date().getFullYear()} Nexus. Demo project — no real funds are
            ever at risk.
          </p>
          <a
            href="https://github.com/yuvrajnode/exchange"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs text-[var(--nx-text-tertiary)] transition-colors hover:text-[var(--nx-text)]"
          >
            <Github className="size-4" />
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
