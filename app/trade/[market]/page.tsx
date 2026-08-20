"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Appbar from "@/components/ui/Appbar";
import { MarketBar } from "@/components/ui/MarketBar";
import { OrderBook } from "@/components/trade/OrderBook";
import { OrderForm } from "@/components/trade/OrderForm";
import { PriceChart } from "@/components/trade/PriceChart";
import { TradeTape } from "@/components/trade/TradeTape";
import { useTicker } from "@/app/utils/useTicker";

export default function TradePage() {
  const params = useParams();
  const market = (params?.market as string) ?? "SOL_USDC";

  const ticker = useTicker(market);
  // Clicking a level in the book pre-fills the order form's limit price.
  const [selectedPrice, setSelectedPrice] = useState<string>();

  // A price picked on one market must never survive into another's form.
  const [renderedMarket, setRenderedMarket] = useState(market);
  if (renderedMarket !== market) {
    setRenderedMarket(market);
    setSelectedPrice(undefined);
  }

  return (
    <div className="min-h-screen bg-[var(--nx-bg)]">
      <Appbar TrueButton={1} />

      <main className="mx-auto max-w-[1600px] p-3">
        <div className="nx-panel mb-3 overflow-visible">
          <MarketBar market={market} ticker={ticker} />
        </div>

        {/*
          Terminal layout. Chart and order book run the full height of both
          rows; the order form and trade tape stack in the right column. Every
          pane is height-constrained so its content scrolls internally rather
          than pushing the page.
        */}
        <div className="grid gap-3 lg:grid-cols-12 lg:grid-rows-[440px_300px]">
          <div className="nx-panel h-[380px] overflow-hidden lg:col-span-6 lg:row-span-2 lg:h-auto">
            <PriceChart market={market} />
          </div>

          <div className="nx-panel h-[560px] overflow-hidden lg:col-span-3 lg:row-span-2 lg:h-auto">
            <OrderBook market={market} onSelectPrice={setSelectedPrice} />
          </div>

          <div className="nx-panel overflow-hidden lg:col-span-3">
            <OrderForm
              // Remount per market so no quantity or side carries over.
              key={market}
              market={market}
              price={selectedPrice}
              lastPrice={ticker?.lastPrice}
            />
          </div>

          <div className="nx-panel h-[300px] overflow-hidden lg:col-span-3 lg:h-auto">
            <TradeTape market={market} />
          </div>
        </div>

      </main>
    </div>
  );
}
