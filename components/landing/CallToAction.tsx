import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";

export function CallToAction() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-5">
      <div className="nx-panel relative overflow-hidden px-6 py-12 text-center sm:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 nx-grid-bg opacity-60 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000,transparent)]"
        />
        <div className="relative">
          <h2 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            Open a market and read the tape
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--nx-text-secondary)]">
            Nothing to install and nothing to sign up for. Every number on the
            screen is live.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/trade/SOL_USDC">
                Open SOL/USDC
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/market">Browse all markets</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
