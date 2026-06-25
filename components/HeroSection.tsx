"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

const STATS = [
  { label: "24h Volume", value: "$2.4B+" },
  { label: "Markets", value: "150+" },
  { label: "Avg. Latency", value: "<5ms" },
  { label: "Active Traders", value: "1.2M" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] },
  }),
};

export default function Hero() {
  const router = useRouter();

  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pt-20 text-center md:pt-28">
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="nx-glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-cyan-300"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
        </span>
        Real-time order matching · Live market data
        <Zap className="h-3.5 w-3.5" />
      </motion.div>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl"
      >
        The exchange
        <br />
        you&apos;ll <span className="nx-gradient-text">actually love</span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-6 max-w-2xl text-lg text-neutral-400"
      >
        Store, buy, sell and stake crypto across any blockchain — powered by a
        low-latency matching engine and real-time WebSocket feeds.
      </motion.p>

      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
      >
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
      </motion.div>

      {/* Stats */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
      >
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
      </motion.div>

      {/* Product preview mock */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] }}
        className="nx-glass nx-glow mt-20 w-full max-w-4xl overflow-hidden rounded-3xl p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-400/70" />
          <span className="h-3 w-3 rounded-full bg-amber-400/70" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
          <span className="ml-3 text-xs text-neutral-500">nexus · SOL / USDC</span>
        </div>
        <div className="relative h-56 overflow-hidden rounded-2xl bg-black/40 nx-grid-bg">
          <svg
            viewBox="0 0 600 200"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
            role="presentation"
          >
            <defs>
              <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,211,238,0.35)" />
                <stop offset="100%" stopColor="rgba(34,211,238,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M0 150 L60 130 L120 145 L180 100 L240 120 L300 70 L360 90 L420 50 L480 75 L540 35 L600 55"
              fill="none"
              stroke="url(#heroFill)"
              strokeWidth="0"
            />
            <motion.path
              d="M0 150 L60 130 L120 145 L180 100 L240 120 L300 70 L360 90 L420 50 L480 75 L540 35 L600 55"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
            />
            <path
              d="M0 150 L60 130 L120 145 L180 100 L240 120 L300 70 L360 90 L420 50 L480 75 L540 35 L600 55 L600 200 L0 200 Z"
              fill="url(#heroFill)"
              opacity="0.6"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}
