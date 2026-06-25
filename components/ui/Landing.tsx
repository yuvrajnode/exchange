"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Hero from "../HeroSection";
import Advertisment from "../Advertisment";

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
      <Advertisment />

      {/* Footer */}
      <footer className="mx-auto mt-24 max-w-7xl px-6 py-10 text-center text-sm text-neutral-500">
        <p>
          Built with Next.js · Real-time data via WebSockets ·{" "}
          <span className="nx-gradient-text font-medium">Nexus Exchange</span>
        </p>
      </footer>
    </>
  );
}
