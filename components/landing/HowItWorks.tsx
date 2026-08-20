import { Activity, BookOpen, CandlestickChart, Radio } from "lucide-react";

const STEPS = [
  {
    icon: Radio,
    title: "One socket, every stream",
    body: "A single multiplexed WebSocket carries ticker and depth updates for every market you have open. Subscriptions are reference-counted, so nothing leaks when a panel unmounts.",
  },
  {
    icon: BookOpen,
    title: "Order book, in real time",
    body: "A REST snapshot seeds the book, then incremental depth messages patch it in place. Cumulative-size bars show where the liquidity actually sits.",
  },
  {
    icon: CandlestickChart,
    title: "Charts that keep up",
    body: "Candlesticks rendered with lightweight-charts, backfilled over REST and updated live. Sparklines are plain SVG, so a hundred of them cost nothing.",
  },
  {
    icon: Activity,
    title: "Proxied and bounded",
    body: "Every upstream call goes through a Next.js route handler with a hard timeout and short-lived caching — no CORS surprises, no request stampedes.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto mt-24 max-w-6xl px-5">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          How it works
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--nx-text-secondary)]">
          Nexus is a front-end over the Backpack Exchange public API. The
          interesting parts are in how the data gets to the screen.
        </p>
      </div>

      <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--nx-radius-lg)] border border-[var(--nx-border)] bg-[var(--nx-border)] sm:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-[var(--nx-surface)] p-6">
            <Icon className="size-5 text-[var(--nx-accent)]" aria-hidden />
            <h3 className="mt-3 text-base font-medium text-[var(--nx-text)]">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--nx-text-secondary)]">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
