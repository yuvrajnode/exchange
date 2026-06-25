"use client";

import { Repeat, ShieldCheck, Activity, Wallet } from "lucide-react";

const FEATURES = [
  {
    icon: Wallet,
    title: "Buy & Sell instantly",
    desc: "Turn your money into real crypto with deep liquidity and tight spreads.",
  },
  {
    icon: Repeat,
    title: "Swap any token",
    desc: "Move between assets on any chain with a single, seamless transaction.",
  },
  {
    icon: Activity,
    title: "Real-time monitoring",
    desc: "Live order books and charts streamed over low-latency WebSockets.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    desc: "Event-driven architecture built to keep your funds and data safe.",
  },
];

export default function Advertisment() {
  return (
    <section className="mx-auto mt-28 max-w-6xl px-6">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Everything you need to{" "}
          <span className="nx-gradient-text">trade smarter</span>
        </h2>
        <p className="mt-3 text-neutral-400">
          A complete toolkit for the modern on-chain trader.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="nx-glass nx-glow-hover group rounded-2xl p-6 text-left"
          >
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 p-3 text-cyan-300 transition-colors group-hover:text-cyan-200">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-neutral-400">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
