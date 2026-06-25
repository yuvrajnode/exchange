"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getAllInfo } from "@/app/utils/httpClient";

interface CoinData {
  symbol: string;
  image: string;
}

export function SwapUI({ market }: { market: string }) {
  const [amount, setAmount] = useState("");
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
  const [type, setType] = useState<"limit" | "market">("limit");
  const [quantity, setQuantity] = useState("");
  const [tokenImage, setTokenImage] = useState("");

  const base = market.split("_")[0]?.toUpperCase() ?? "";
  const isBuy = activeTab === "buy";

  useEffect(() => {
    async function fetchImage() {
      try {
        const data: CoinData[] = await getAllInfo();
        const image = data.find(
          (d: CoinData) => d.symbol.toUpperCase() === base
        )?.image;
        setTokenImage(image || "");
      } catch (error) {
        console.error("Failed to fetch token image:", error);
      }
    }
    fetchImage();
  }, [base]);

  return (
    <div className="flex flex-col p-4">
      {/* Buy / Sell tabs */}
      <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-black/30 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("buy")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
            isBuy
              ? "bg-emerald-500/20 text-emerald-300 shadow-[0_0_20px_-6px_rgba(52,211,153,0.6)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sell")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
            !isBuy
              ? "bg-rose-500/20 text-rose-300 shadow-[0_0_20px_-6px_rgba(244,63,94,0.6)]"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Order type */}
      <div className="mb-4 flex gap-6 border-b border-white/10">
        {(["limit", "market"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`-mb-px border-b-2 pb-2 text-sm font-medium capitalize transition-colors ${
              type === t
                ? "border-cyan-400 text-white"
                : "border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Balance */}
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="text-neutral-400">Available Balance</span>
        <span className="font-medium text-neutral-200">36.94 USDC</span>
      </div>

      {/* Price */}
      <div className="mb-1 text-xs text-neutral-400">
        {type === "market" ? "Price (Market)" : "Price"}
      </div>
      <div className="relative mb-4">
        <input
          step="0.01"
          placeholder="0"
          disabled={type === "market"}
          className="h-12 w-full rounded-lg border border-white/10 bg-black/40 pr-12 text-right text-lg text-white outline-none transition focus:border-cyan-400/60 disabled:opacity-50"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-400">
          USDC
        </span>
      </div>

      {/* Quantity */}
      <div className="mb-1 text-xs text-neutral-400">Quantity</div>
      <div className="relative mb-2">
        <input
          step="0.01"
          placeholder="0"
          className="h-12 w-full rounded-lg border border-white/10 bg-black/40 pr-12 text-right text-lg text-white outline-none transition focus:border-cyan-400/60"
          type="text"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {tokenImage ? (
            <Image
              src={tokenImage}
              alt={base}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <span className="text-xs text-neutral-400">{base}</span>
          )}
        </span>
      </div>

      <div className="mb-3 text-right text-xs text-neutral-400">≈ 0.00 USDC</div>

      {/* Percent shortcuts */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {["25%", "50%", "75%", "Max"].map((p) => (
          <button
            key={p}
            type="button"
            className="rounded-full bg-white/5 py-1.5 text-xs text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={() =>
          alert(`${isBuy ? "Buy" : "Sell"} order placed for ${base}`)
        }
        className={`h-12 rounded-xl text-base font-semibold text-white transition-all active:scale-[0.98] ${
          isBuy
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_8px_30px_-8px_rgba(52,211,153,0.8)]"
            : "bg-gradient-to-r from-rose-500 to-red-500 hover:shadow-[0_8px_30px_-8px_rgba(244,63,94,0.8)]"
        }`}
      >
        {isBuy ? "Buy" : "Sell"} {base}
      </button>

      {/* Options */}
      <div className="mt-4 flex gap-5 text-xs text-neutral-400">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-cyan-500" />
          Post Only
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" className="h-4 w-4 accent-cyan-500" />
          IOC
        </label>
      </div>
    </div>
  );
}
