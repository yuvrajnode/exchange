"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search, Star } from "lucide-react";
import type { CombinedCryptoData } from "@/app/utils/combine-data";
import { CoinIcon } from "@/components/ui/primitives/CoinIcon";
import { Change } from "@/components/ui/primitives/Change";
import { Sparkline } from "@/components/ui/primitives/Sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompactUsd, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortKey = "market_cap" | "current_price" | "total_volume" | "price_change_percentage_24h" | "name";
type Tab = "all" | "favorites";

const PAGE_SIZE = 15;

const COLUMNS: {
  key: SortKey | null;
  label: string;
  align: "left" | "right";
  className?: string;
}[] = [
  { key: "name", label: "Name", align: "left" },
  { key: "current_price", label: "Price", align: "right" },
  { key: "price_change_percentage_24h", label: "24h", align: "right" },
  { key: "market_cap", label: "Market cap", align: "right", className: "hidden md:table-cell" },
  { key: "total_volume", label: "24h volume", align: "right", className: "hidden lg:table-cell" },
  { key: null, label: "Last 7 days", align: "right", className: "hidden sm:table-cell" },
];

export function MarketsTable({
  data,
  favorites,
  onToggleFavorite,
}: {
  data: CombinedCryptoData[] | null;
  favorites: string[];
  onToggleFavorite: (symbol: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({
    key: "market_cap",
    desc: true,
  });
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();

    const filtered = data
      .filter((c) => !c.symbol.toLowerCase().includes("usdc"))
      .filter((c) =>
        query
          ? c.name.toLowerCase().includes(query) ||
            c.symbol.toLowerCase().includes(query)
          : true
      )
      .filter((c) =>
        tab === "favorites" ? favorites.includes(c.symbol.toUpperCase()) : true
      );

    return filtered.sort((a, b) => {
      const dir = sort.desc ? -1 : 1;
      if (sort.key === "name") return a.name.localeCompare(b.name) * dir;
      return ((a[sort.key] ?? 0) - (b[sort.key] ?? 0)) * dir;
    });
  }, [data, search, tab, favorites, sort]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = rows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Any change to the result set invalidates the current page.
  const resetPage = () => setPage(1);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, desc: !prev.desc }
        : { key, desc: key !== "name" }
    );
    resetPage();
  };

  return (
    <section className="nx-panel overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[var(--nx-border)] p-4 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="Market list"
          className="flex gap-1 rounded-[var(--nx-radius)] bg-[var(--nx-surface-sunken)] p-1"
        >
          {(["all", "favorites"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => {
                setTab(value);
                resetPage();
              }}
              className={cn(
                "rounded-[var(--nx-radius-sm)] px-3.5 py-1.5 text-sm font-medium transition-colors",
                tab === value
                  ? "bg-[var(--nx-surface-hover)] text-[var(--nx-text)]"
                  : "text-[var(--nx-text-secondary)] hover:text-[var(--nx-text)]"
              )}
            >
              {value === "all" ? "All markets" : `Favorites (${favorites.length})`}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--nx-text-tertiary)]"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
            placeholder="Search name or symbol"
            aria-label="Search markets"
            className="h-10 w-full rounded-[var(--nx-radius)] border border-[var(--nx-border-strong)] bg-[var(--nx-surface-sunken)] pl-9 pr-3 text-sm text-[var(--nx-text)] outline-none transition-colors placeholder:text-[var(--nx-text-tertiary)] focus:border-[var(--nx-accent)]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-[var(--nx-border)]">
              <th scope="col" className="w-10 py-2.5 pl-4">
                <span className="sr-only">Favorite</span>
              </th>
              {COLUMNS.map((column) => (
                <th
                  key={column.label}
                  scope="col"
                  aria-sort={
                    column.key && sort.key === column.key
                      ? sort.desc
                        ? "descending"
                        : "ascending"
                      : undefined
                  }
                  className={cn(
                    "py-2.5 pr-4",
                    column.align === "right" ? "text-right" : "text-left",
                    column.className
                  )}
                >
                  {column.key ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key as SortKey)}
                      className={cn(
                        "nx-label inline-flex items-center gap-1 transition-colors hover:text-[var(--nx-text)]",
                        sort.key === column.key && "text-[var(--nx-text)]"
                      )}
                    >
                      {column.label}
                      {sort.key === column.key &&
                        (sort.desc ? (
                          <ArrowDown className="size-3" aria-hidden />
                        ) : (
                          <ArrowUp className="size-3" aria-hidden />
                        ))}
                    </button>
                  ) : (
                    <span className="nx-label">{column.label}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!data ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--nx-border)]">
                  <td colSpan={7} className="px-4 py-3">
                    <Skeleton className="h-8 w-full" />
                  </td>
                </tr>
              ))
            ) : pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-16 text-center text-sm text-[var(--nx-text-secondary)]"
                >
                  {tab === "favorites"
                    ? "No favorites yet — star a market to pin it here."
                    : "No markets match your search."}
                </td>
              </tr>
            ) : (
              pageRows.map((coin) => (
                <Row
                  key={coin.id}
                  coin={coin}
                  isFavorite={favorites.includes(coin.symbol.toUpperCase())}
                  onToggleFavorite={onToggleFavorite}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-[var(--nx-border)] px-4 py-3 text-sm">
          <span className="text-[var(--nx-text-secondary)]">
            <span className="nx-num">
              {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, rows.length)}
            </span>{" "}
            of <span className="nx-num">{rows.length}</span>
          </span>
          <div className="flex items-center gap-2">
            <PagerButton
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </PagerButton>
            <span className="nx-num text-[var(--nx-text-secondary)]">
              {currentPage} / {totalPages}
            </span>
            <PagerButton
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </PagerButton>
          </div>
        </div>
      )}
    </section>
  );
}

function PagerButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-[var(--nx-radius-sm)] border border-[var(--nx-border-strong)] px-3 py-1.5 text-sm font-medium text-[var(--nx-text-secondary)] transition-colors hover:border-[var(--nx-text-tertiary)] hover:text-[var(--nx-text)] disabled:opacity-40 disabled:hover:border-[var(--nx-border-strong)] disabled:hover:text-[var(--nx-text-secondary)]"
    >
      {children}
    </button>
  );
}

function Row({
  coin,
  isFavorite,
  onToggleFavorite,
}: {
  coin: CombinedCryptoData;
  isFavorite: boolean;
  onToggleFavorite: (symbol: string) => void;
}) {
  const router = useRouter();
  const market = `${coin.symbol.toUpperCase()}_USDC`;
  const series = coin.KlineData?.map((p) => Number(p.close)) ?? [];

  return (
    // The anchor in the name cell is the accessible target; the row handler
    // just widens the hit area for pointer users.
    <tr
      onClick={() => router.push(`/trade/${market}`)}
      className="group cursor-pointer border-b border-[var(--nx-border)] transition-colors last:border-0 hover:bg-[var(--nx-surface-hover)]"
    >
      <td className="py-3 pl-4 align-middle">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(coin.symbol.toUpperCase());
          }}
          aria-label={
            isFavorite
              ? `Remove ${coin.name} from favorites`
              : `Add ${coin.name} to favorites`
          }
          aria-pressed={isFavorite}
          className="rounded p-1 text-[var(--nx-text-tertiary)] transition-colors hover:text-[var(--nx-warn)]"
        >
          <Star
            className="size-4"
            fill={isFavorite ? "var(--nx-warn)" : "none"}
            color={isFavorite ? "var(--nx-warn)" : "currentColor"}
          />
        </button>
      </td>

      <td className="py-3 pr-4">
        <Link
          href={`/trade/${market}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3"
        >
          <CoinIcon src={coin.image} symbol={coin.symbol} size={30} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-[var(--nx-text)]">
              {coin.name}
            </span>
            <span className="block text-xs uppercase text-[var(--nx-text-tertiary)]">
              {coin.symbol}
            </span>
          </span>
        </Link>
      </td>

      <td className="nx-num py-3 pr-4 text-right text-sm">
        {formatPrice(coin.current_price)}
      </td>
      <td className="py-3 pr-4 text-right">
        <Change value={coin.price_change_percentage_24h} className="justify-end text-sm" />
      </td>
      <td className="nx-num hidden py-3 pr-4 text-right text-sm text-[var(--nx-text-secondary)] md:table-cell">
        {formatCompactUsd(coin.market_cap)}
      </td>
      <td className="nx-num hidden py-3 pr-4 text-right text-sm text-[var(--nx-text-secondary)] lg:table-cell">
        {formatCompactUsd(coin.total_volume)}
      </td>
      <td className="hidden py-3 pr-4 sm:table-cell">
        <div className="flex justify-end">
          <Sparkline values={series} width={112} height={32} />
        </div>
      </td>
    </tr>
  );
}
