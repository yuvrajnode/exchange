"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { CombinedCryptoData } from "@/app/utils/combine-data";
import { CoinIcon } from "@/components/ui/primitives/CoinIcon";
import { Change } from "@/components/ui/primitives/Change";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/format";

/**
 * Replaces the old promo carousel, which rotated three hard-coded slides with
 * placeholder copy. Three ranked lists off the live payload are both more
 * useful and impossible to leave stale.
 */
export function MarketHighlights({
  data,
}: {
  data: CombinedCryptoData[] | null;
}) {
  const groups = useMemo(() => {
    if (!data) return null;
    const tradable = data.filter((c) => !c.symbol.toLowerCase().includes("usdc"));
    const byChange = [...tradable].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );

    return [
      { title: "Top gainers", items: byChange.slice(0, 5) },
      { title: "Top losers", items: byChange.slice(-5).reverse() },
      {
        title: "Most active",
        items: [...tradable]
          .sort((a, b) => b.total_volume - a.total_volume)
          .slice(0, 5),
      },
    ];
  }, [data]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {(groups ?? [{ title: "Top gainers" }, { title: "Top losers" }, { title: "Most active" }]).map(
        (group) => (
          <section key={group.title} className="nx-panel">
            <h2 className="border-b border-[var(--nx-border)] px-4 py-3 text-sm font-semibold">
              {group.title}
            </h2>
            <ul className="divide-y divide-[var(--nx-border)]">
              {("items" in group && group.items
                ? group.items
                : Array.from({ length: 5 })
              ).map((entry, i) => {
                const coin = entry as CombinedCryptoData | undefined;

                if (!coin) {
                  return (
                    <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <Skeleton className="size-7 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="ml-auto h-4 w-20" />
                    </li>
                  );
                }

                return (
                  <li key={coin.id}>
                    <Link
                      href={`/trade/${coin.symbol.toUpperCase()}_USDC`}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--nx-surface-hover)]"
                    >
                      <CoinIcon src={coin.image} symbol={coin.symbol} size={26} />
                      <span className="text-sm font-medium uppercase">
                        {coin.symbol}
                      </span>
                      <span className="ml-auto flex flex-col items-end">
                        <span className="nx-num text-sm">
                          {formatPrice(coin.current_price)}
                        </span>
                        <Change
                          value={coin.price_change_percentage_24h}
                          className="text-xs"
                        />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )
      )}
    </div>
  );
}
