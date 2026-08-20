"use client";

import { useEffect, useState } from "react";
import type { Ticker } from "@/app/utils/types";
import { getAllInfo } from "@/app/utils/httpClient";
import { CoinIcon } from "@/components/ui/primitives/CoinIcon";
import { MarketPicker } from "@/components/trade/MarketPicker";
import { Change } from "@/components/ui/primitives/Change";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact, formatNumber, formatPrice } from "@/lib/format";

export function MarketBar({
  market,
  ticker,
}: {
  market: string;
  ticker: Ticker | null;
}) {
  const [base, quote] = market.split("_");
  const [logos, setLogos] = useState<{ base?: string; quote?: string }>({});

  useEffect(() => {
    let active = true;
    getAllInfo()
      .then((coins) => {
        if (!active) return;
        const find = (symbol: string) =>
          coins.find((c) => c.symbol.toLowerCase() === symbol?.toLowerCase())
            ?.image;
        setLogos({ base: find(base), quote: find(quote) });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [base, quote]);

  const change = ticker ? Number(ticker.priceChangePercent) * 100 : NaN;
  const up = change >= 0;

  return (
    <div className="flex items-center gap-5 overflow-x-auto px-3 py-2 no-scrollbar">
      <div className="flex shrink-0 items-center gap-2.5">
        <span className="flex items-center">
          <CoinIcon src={logos.base} symbol={base} size={26} />
          <CoinIcon
            src={logos.quote}
            symbol={quote}
            size={26}
            className="-ml-2 ring-2 ring-[var(--nx-surface)]"
          />
        </span>
        <MarketPicker market={market} />
      </div>

      <div className="h-8 w-px shrink-0 bg-[var(--nx-border)]" />

      <div className="flex shrink-0 flex-col justify-center">
        {ticker ? (
          <span
            className={`nx-num text-lg font-semibold ${
              up ? "text-[var(--nx-up)]" : "text-[var(--nx-down)]"
            }`}
          >
            {formatPrice(ticker.lastPrice)}
          </span>
        ) : (
          <Skeleton className="h-6 w-24" />
        )}
        <span className="nx-label mt-0.5">Last price</span>
      </div>

      <Stat label="24h change">
        {ticker ? <Change value={change} /> : <Skeleton className="h-4 w-20" />}
      </Stat>
      <Stat label="24h high">{ticker ? formatNumber(ticker.high, 2) : null}</Stat>
      <Stat label="24h low">{ticker ? formatNumber(ticker.low, 2) : null}</Stat>
      <Stat label={`24h volume (${base})`}>
        {ticker ? formatCompact(ticker.volume) : null}
      </Stat>
      <Stat label={`24h volume (${quote})`}>
        {ticker ? formatCompact(ticker.quoteVolume) : null}
      </Stat>
    </div>
  );
}

function Stat({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="hidden shrink-0 flex-col justify-center sm:flex">
      <span className="nx-label">{label}</span>
      <span className="nx-num mt-0.5 text-sm font-medium text-[var(--nx-text)]">
        {children ?? <Skeleton className="h-4 w-16" />}
      </span>
    </div>
  );
}
