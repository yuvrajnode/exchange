"use client";
import { useParams } from "next/navigation";
import { Depth } from "@/components/ui/depth/Depth";
import { TradeView } from "@/components/ui/Tradeview";
import Appbar from "@/components/ui/Appbar";
import { SwapUI } from "@/components/ui/SwapUi";
import { MarketBar } from "@/components/ui/MarketBar";

export default function Page() {
  const { market } = useParams();
  const number = 1;

  return (
    <div className="relative min-h-screen w-full bg-[var(--nx-bg)] font-inter text-white">
      <div className="pointer-events-none fixed inset-0 nx-grid-bg opacity-20" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-3 pb-6">
        <Appbar TrueButton={number} />

        {/* Market summary bar */}
        <div className="nx-glass mb-3 overflow-x-auto rounded-2xl px-4 py-2 no-scrollbar">
          <MarketBar market={market as string} />
        </div>

        {/* Main trading grid */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          {/* Chart */}
          <div className="nx-glass rounded-2xl p-2 lg:col-span-7">
            <TradeView market={market as string} />
          </div>

          {/* Order book */}
          <div className="nx-glass rounded-2xl p-3 lg:col-span-2">
            <Depth market={market as string} />
          </div>

          {/* Order entry */}
          <div className="nx-glass rounded-2xl lg:col-span-3">
            <SwapUI market={market as string} />
          </div>
        </div>
      </div>
    </div>
  );
}
