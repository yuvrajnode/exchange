import type { CoinInfo, LineCryptoDataPoint } from "./types";
import { getAllInfo, getMarketKlines } from "./httpClient";

export type CombinedCryptoData = CoinInfo & {
  KlineData?: LineCryptoDataPoint[];
};

const SEVEN_DAYS_MS = 1000 * 60 * 60 * 24 * 7;

/**
 * Joins coin metadata with its 7-day price series. The two upstreams are
 * independent, so a sparkline outage still leaves a usable markets table.
 */
export async function CombineData(): Promise<CombinedCryptoData[]> {
  const now = Date.now();

  const [coinsResult, klinesResult] = await Promise.allSettled([
    getAllInfo(),
    getMarketKlines(
      Math.floor((now - SEVEN_DAYS_MS) / 1000),
      Math.floor(now / 1000)
    ),
  ]);

  if (coinsResult.status === "rejected") {
    throw coinsResult.reason;
  }

  const klines = klinesResult.status === "fulfilled" ? klinesResult.value : [];
  const seriesBySymbol = new Map(
    klines.map((market) => [
      market.symbol.replace("_USDC", "").toLowerCase(),
      market.data,
    ])
  );

  return coinsResult.value.map((coin) => ({
    ...coin,
    KlineData: seriesBySymbol.get(coin.symbol.toLowerCase()),
  }));
}
