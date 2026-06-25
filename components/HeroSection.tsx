"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Zap } from "lucide-react";

const STATS = [
  { label: "24h Volume", value: "$2.4B+" },
  { label: "Markets", value: "150+" },
  { label: "Avg. Latency", value: "<5ms" },
  { label: "Active Traders", value: "1.2M" },
];

export default function Hero() {
  const router = useRouter();

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 text-center md:pt-28">
      <div className="nx-glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300">
        <Zap className="h-3.5 w-3.5" />
        Real-time order matching · Live market data
      </div>

      <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
        The exchange
        <br />
        you&apos;ll <span className="nx-gradient-text">actually love</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-neutral-400">
        Store, buy, sell and stake crypto across any blockchain — powered by a
        low-latency matching engine and real-time WebSocket feeds.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/trade/SOL_USDC")}
          className="nx-glow-hover group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3.5 text-base font-semibold text-white"
        >
          Start Trading
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        <button
          type="button"
          onClick={() => router.push("/market")}
          className="nx-glass rounded-xl px-8 py-3.5 text-base font-semibold text-neutral-200 transition-colors hover:text-white"
        >
          Explore Markets
        </button>
      </div>

      {/* Stats */}
      <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="nx-glass nx-glow-hover rounded-2xl px-4 py-6"
          >
            <div className="text-2xl font-bold nx-gradient-text md:text-3xl">
              {stat.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-neutral-500">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
