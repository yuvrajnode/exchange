"use client";

import type { CombinedCryptoData } from "@/app/utils/combine-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Change } from "@/components/ui/primitives/Change";
import { formatCompactUsd } from "@/lib/format";

/**
 * Market-wide totals. Derived from the same payload the table renders, so the
 * header can never disagree with the rows beneath it.
 */
export function MarketsSummary({ data }: { data: CombinedCryptoData[] | null }) {
  const totals = data && {
    marketCap: data.reduce((sum, c) => sum + (c.market_cap || 0), 0),
    volume: data.reduce((sum, c) => sum + (c.total_volume || 0), 0),
    assets: data.length,
    // Cap-weighted so a micro-cap doubling doesn't swing the headline.
    change:
      data.reduce(
        (sum, c) => sum + (c.price_change_percentage_24h || 0) * (c.market_cap || 0),
        0
      ) / (data.reduce((sum, c) => sum + (c.market_cap || 0), 0) || 1),
  };

  return (
    <div className="grid gap-px overflow-hidden rounded-[var(--nx-radius-lg)] border border-[var(--nx-border)] bg-[var(--nx-border)] sm:grid-cols-2 lg:grid-cols-4">
      <Cell label="Total market cap" value={totals && formatCompactUsd(totals.marketCap)} />
      <Cell label="24h volume" value={totals && formatCompactUsd(totals.volume)} />
      <Cell label="Tracked assets" value={totals && String(totals.assets)} />
      <Cell
        label="Market 24h"
        value={totals ? "" : null}
        slot={totals ? <Change value={totals.change} className="text-xl font-semibold" /> : null}
      />
    </div>
  );
}

function Cell({
  label,
  value,
  slot,
}: {
  label: string;
  value?: string | null;
  slot?: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--nx-surface)] px-4 py-3.5">
      <div className="nx-label">{label}</div>
      <div className="mt-1">
        {slot ??
          (value ? (
            <span className="nx-num text-xl font-semibold text-[var(--nx-text)]">
              {value}
            </span>
          ) : (
            <Skeleton className="h-6 w-24" />
          ))}
      </div>
    </div>
  );
}
