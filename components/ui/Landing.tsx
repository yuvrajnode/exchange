"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Hero from "../HeroSection";
import Advertisment from "../Advertisment";
import MarketsPreview from "./MarketsPreview";

const NAV_LINKS = [
  { label: "Explore", path: "/" },
  { label: "Markets", path: "/market" },
  { label: "Trade", path: "/trade/SOL_USDC" },
];

export default function Landing() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-50 px-4 pt-4">
        <nav className="nx-glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3">
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.push("/")}
          >
            <Image src="/logo.svg" alt="Nexus logo" height={26} width={30} />
            <span className="text-lg font-bold tracking-wide nx-gradient-text">
              NEXUS
            </span>
          </div>

          <ul className="hidden flex-1 items-center justify-center gap-12 md:flex">
            {NAV_LINKS.map((link) => (
              <li
                key={link.label}
                onClick={() => router.push(link.path)}
                className="cursor-pointer text-sm font-medium tracking-wide text-neutral-400 transition-colors hover:text-white"
              >
                {link.label}
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <button
              type="button"
              onClick={() => router.push("/market")}
              className="nx-glow-hover rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white"
            >
              Launch App
            </button>
          </div>

          <button
            type="button"
            className="text-neutral-300 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </nav>

        {open && (
          <div className="nx-glass mx-auto mt-2 max-w-7xl rounded-2xl p-4 md:hidden">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  onClick={() => {
                    router.push(link.path);
                    setOpen(false);
                  }}
                  className="cursor-pointer rounded-lg px-3 py-2 text-neutral-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <Hero />
      <MarketsPreview />
      <Advertisment />

      {/* CTA band */}
      <section className="mx-auto mt-28 max-w-6xl px-6">
        <div className="nx-glass nx-glow relative overflow-hidden rounded-3xl px-8 py-14 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-600/30 blur-[100px]" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Ready to <span className="nx-gradient-text">trade smarter?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-neutral-400">
              Jump into live markets with real-time charts and a low-latency
              order book. No sign-up required to explore.
            </p>
            <button
              type="button"
              onClick={() => router.push("/trade/SOL_USDC")}
              className="nx-glow-hover mt-8 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3.5 text-base font-semibold text-white"
            >
              Launch the App
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-24 max-w-6xl px-6 py-12">
        <div className="nx-glass flex flex-col items-center justify-between gap-6 rounded-2xl px-8 py-8 md:flex-row">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Nexus logo" height={22} width={26} />
            <span className="text-lg font-bold tracking-wide nx-gradient-text">
              NEXUS
            </span>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
            {NAV_LINKS.map((link) => (
              <li
                key={link.label}
                onClick={() => router.push(link.path)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                {link.label}
              </li>
            ))}
          </ul>
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Nexus · Built with Next.js
          </p>
        </div>
      </footer>
    </>
  );
}
