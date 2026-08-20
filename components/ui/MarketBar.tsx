"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Ticker } from "../../app/utils/types";
import { getAllInfo, getTicker } from "../../app/utils/httpClient";
import { SignalingManager } from "../../app/utils/SignalingManager";
import { formatCompact, formatPrice, formatSignedPercent } from "@/lib/format";

export const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [tokenImage, setTokenImage] = useState<string | null>(null);
  const [quoteImage, setQuoteImage] = useState<string | null>(null);

  const [base, quote] = market.split("_");

  useEffect(() => {
    let active = true;

    getAllInfo()
      .then((coins) => {
        if (!active) return;
        const bySymbol = (symbol: string) =>
          coins.find((c) => c.symbol.toLowerCase() === symbol.toLowerCase())
            ?.image ?? null;
        setTokenImage(bySymbol(base));
        setQuoteImage(bySymbol(quote ?? "usdc"));
      })
      .catch((error) => {
        console.error("Failed to fetch token images:", error);
      });

    return () => {
      active = false;
    };
  }, [base, quote]);

  useEffect(() => {
    let cancelled = false;
    const subscriptionKey = `TICKER-${market}`;

    getTicker(market)
      .then((result) => {
        if (!cancelled && result) setTicker(result);
      })
      .catch((error) => {
        console.error("Failed to fetch ticker snapshot:", error);
      });

    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: unknown) => {
        const update = data as Partial<Ticker>;
        setTicker((prev) => ({
          firstPrice: update.firstPrice ?? prev?.firstPrice ?? "",
          high: update.high ?? prev?.high ?? "",
          lastPrice: update.lastPrice ?? prev?.lastPrice ?? "",
          low: update.low ?? prev?.low ?? "",
          priceChange: update.priceChange ?? prev?.priceChange ?? "",
          priceChangePercent:
            update.priceChangePercent ?? prev?.priceChangePercent ?? "",
          quoteVolume: update.quoteVolume ?? prev?.quoteVolume ?? "",
          symbol: update.symbol ?? prev?.symbol ?? market,
          trades: update.trades ?? prev?.trades ?? "",
          volume: update.volume ?? prev?.volume ?? "",
        }));
      },
      subscriptionKey
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${market}`],
    });

    return () => {
      cancelled = true;
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback(
        "ticker",
        subscriptionKey
      );
    };
  }, [market]);

  const change = Number(ticker?.priceChange);
  const up = Number.isFinite(change) && change >= 0;

  return (
    <div className="flex w-full items-center gap-6 overflow-x-auto no-scrollbar">
      <MarketIdentity
        market={market}
        baseImage={tokenImage}
        quoteImage={quoteImage}
      />

      <Stat
        label="Last price"
        value={ticker ? formatPrice(ticker.lastPrice) : null}
        tone={up ? "up" : "down"}
        emphasis
      />
      <Stat
        label="24h Change"
        value={
          ticker
            ? `${up ? "+" : ""}${ticker.priceChange} (${formatSignedPercent(
                // The API sends a fraction — 0.0699 means +6.99%.
                Number(ticker.priceChangePercent) * 100
              )})`
            : null
        }
        tone={up ? "up" : "down"}
      />
      <Stat label="24h High" value={ticker ? formatPrice(ticker.high) : null} />
      <Stat label="24h Low" value={ticker ? formatPrice(ticker.low) : null} />
      <Stat
        label="24h Volume"
        value={ticker ? formatCompact(Number(ticker.volume)) : null}
      />
    </div>
  );
};

function Stat({
  label,
  value,
  tone,
  emphasis,
}: {
  label: string;
  value: string | null;
  tone?: "up" | "down";
  emphasis?: boolean;
}) {
  const toneClass =
    tone === "up" ? "text-nx-up" : tone === "down" ? "text-nx-down" : "text-white";

  return (
    <div className="flex shrink-0 flex-col justify-center">
      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">
        {label}
      </span>
      {value === null ? (
        <span className="mt-1 block h-4 w-20 animate-pulse rounded bg-white/10" />
      ) : (
        <span
          className={`tabular-nums ${
            emphasis ? "text-lg font-semibold" : "text-sm font-medium"
          } ${toneClass}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}

function MarketIdentity({
  market,
  baseImage,
  quoteImage,
}: {
  market: string;
  baseImage: string | null;
  quoteImage: string | null;
}) {
  const [base, quote] = market.split("_");

  return (
    <div className="flex shrink-0 items-center gap-3 pr-2">
      <div className="flex items-center">
        <CoinAvatar src={baseImage} symbol={base} />
        <CoinAvatar src={quoteImage} symbol={quote} className="-ml-2" />
      </div>
      <span className="text-base font-semibold text-white">
        {base} <span className="text-neutral-500">/</span> {quote}
      </span>
    </div>
  );
}

/** next/image throws on an empty src, so an initial-letter chip stands in. */
function CoinAvatar({
  src,
  symbol,
  className = "",
}: {
  src: string | null;
  symbol?: string;
  className?: string;
}) {
  if (!src) {
    return (
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-neutral-300 ring-2 ring-[var(--nx-bg)] ${className}`}
      >
        {symbol?.[0] ?? "?"}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={symbol ?? "market"}
      width={28}
      height={28}
      className={`h-7 w-7 rounded-full ring-2 ring-[var(--nx-bg)] ${className}`}
    />
  );
}
