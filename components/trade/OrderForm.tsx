"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Demo balances. This front-end has no wallet or matching engine behind it,
 * so the numbers are fixed and the panel says so rather than implying funds.
 */
const DEMO_BALANCE = { quote: 25_000, base: 120 };
const PERCENTAGES = [25, 50, 75, 100];

type Side = "buy" | "sell";
type OrderType = "limit" | "market";

export function OrderForm({
  market,
  price,
  lastPrice,
}: {
  market: string;
  /** Price pushed in from an order-book click. */
  price?: string;
  lastPrice?: string;
}) {
  const [base, quote] = market.split("_");
  const [side, setSide] = useState<Side>("buy");
  const [type, setType] = useState<OrderType>("limit");
  const [limitPrice, setLimitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [placed, setPlaced] = useState<string | null>(null);

  // An order-book click overwrites the limit price, as on a real venue.
  const [appliedPrice, setAppliedPrice] = useState(price);
  if (price !== appliedPrice) {
    setAppliedPrice(price);
    if (price) setLimitPrice(price);
  }

  const effectivePrice =
    type === "market" ? Number(lastPrice) : Number(limitPrice || lastPrice);

  const total = useMemo(() => {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || !Number.isFinite(effectivePrice)) return 0;
    return qty * effectivePrice;
  }, [quantity, effectivePrice]);

  const available = side === "buy" ? DEMO_BALANCE.quote : DEMO_BALANCE.base;
  const availableUnit = side === "buy" ? quote : base;

  const applyPercentage = (pct: number) => {
    if (!Number.isFinite(effectivePrice) || effectivePrice <= 0) return;
    const qty =
      side === "buy"
        ? (DEMO_BALANCE.quote * (pct / 100)) / effectivePrice
        : DEMO_BALANCE.base * (pct / 100);
    setQuantity(qty.toFixed(4));
  };

  const insufficient =
    side === "buy" ? total > DEMO_BALANCE.quote : Number(quantity) > DEMO_BALANCE.base;
  const canSubmit = Number(quantity) > 0 && effectivePrice > 0 && !insufficient;

  const submit = () => {
    setPlaced(
      `${side === "buy" ? "Buy" : "Sell"} ${formatNumber(quantity, 4)} ${base} at ${
        type === "market" ? "market" : formatNumber(effectivePrice, 2)
      }`
    );
    setQuantity("");
  };

  return (
    <div className="nx-scroll flex h-full flex-col overflow-y-auto p-3">
      {/* Side */}
      <div
        role="tablist"
        aria-label="Order side"
        className="grid grid-cols-2 gap-1 rounded-[var(--nx-radius)] bg-[var(--nx-surface-sunken)] p-1"
      >
        {(["buy", "sell"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={side === value}
            onClick={() => setSide(value)}
            className={cn(
              "rounded-[var(--nx-radius-sm)] py-2 text-sm font-semibold capitalize transition-colors",
              side === value
                ? value === "buy"
                  ? "bg-[var(--nx-up-soft)] text-[var(--nx-up)]"
                  : "bg-[var(--nx-down-soft)] text-[var(--nx-down)]"
                : "text-[var(--nx-text-secondary)] hover:text-[var(--nx-text)]"
            )}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Type */}
      <div className="mt-3 flex gap-4 border-b border-[var(--nx-border)]">
        {(["limit", "market"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setType(value)}
            aria-pressed={type === value}
            className={cn(
              "-mb-px border-b-2 pb-2 text-sm font-medium capitalize transition-colors",
              type === value
                ? "border-[var(--nx-accent)] text-[var(--nx-text)]"
                : "border-transparent text-[var(--nx-text-secondary)] hover:text-[var(--nx-text)]"
            )}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-[var(--nx-text-secondary)]">Available</span>
        <span className="nx-num text-[var(--nx-text)]">
          {formatNumber(available, 2)} {availableUnit}
        </span>
      </div>

      <Field
        label="Price"
        suffix={quote}
        value={type === "market" ? "" : limitPrice}
        placeholder={type === "market" ? "Market" : formatNumber(lastPrice ?? 0, 2)}
        onChange={setLimitPrice}
        disabled={type === "market"}
      />

      <Field
        label="Quantity"
        suffix={base}
        value={quantity}
        placeholder="0.00"
        onChange={setQuantity}
      />

      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {PERCENTAGES.map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => applyPercentage(pct)}
            className="rounded-[var(--nx-radius-sm)] border border-[var(--nx-border-strong)] py-1.5 text-xs font-medium text-[var(--nx-text-secondary)] transition-colors hover:border-[var(--nx-accent)] hover:text-[var(--nx-text)]"
          >
            {pct === 100 ? "Max" : `${pct}%`}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[var(--nx-border)] pt-3 text-xs">
        <span className="text-[var(--nx-text-secondary)]">Order value</span>
        <span className="nx-num text-[var(--nx-text)]">
          {formatNumber(total, 2)} {quote}
        </span>
      </div>

      {insufficient && (
        <p className="mt-2 text-xs text-[var(--nx-down)]">
          Exceeds available {availableUnit} balance.
        </p>
      )}

      <Button
        variant={side === "buy" ? "buy" : "sell"}
        size="lg"
        block
        className="mt-3"
        disabled={!canSubmit}
        onClick={submit}
      >
        {side === "buy" ? "Buy" : "Sell"} {base}
      </Button>

      {placed && (
        <p
          role="status"
          className="mt-3 rounded-[var(--nx-radius-sm)] border border-[var(--nx-border)] bg-[var(--nx-surface-sunken)] px-3 py-2 text-xs text-[var(--nx-text-secondary)]"
        >
          Simulated: {placed}
        </p>
      )}

      <p className="mt-auto flex items-start gap-1.5 pt-4 text-[11px] leading-relaxed text-[var(--nx-text-tertiary)]">
        <Info className="mt-px size-3 shrink-0" aria-hidden />
        Demo terminal — balances are simulated and no order is ever sent to an
        exchange.
      </p>
    </div>
  );
}

function Field({
  label,
  suffix,
  value,
  placeholder,
  onChange,
  disabled,
}: {
  label: string;
  suffix: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="mt-3 block">
      <span className="nx-label">{label}</span>
      <span className="relative mt-1 flex items-center">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          // Digits, one decimal point, nothing else.
          onChange={(e) => {
            const next = e.target.value;
            if (next === "" || /^\d*\.?\d*$/.test(next)) onChange(next);
          }}
          className="nx-num h-11 w-full rounded-[var(--nx-radius)] border border-[var(--nx-border-strong)] bg-[var(--nx-surface-sunken)] pl-3 pr-14 text-right text-sm text-[var(--nx-text)] outline-none transition-colors placeholder:text-[var(--nx-text-tertiary)] focus:border-[var(--nx-accent)] disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-3 text-xs font-medium text-[var(--nx-text-tertiary)]">
          {suffix}
        </span>
      </span>
    </label>
  );
}
