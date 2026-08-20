import axios from "axios";
import { CoinInfo, KLine, LineCryptoData, Ticker, Trade, marketData } from "./types";

const api = axios.create({ baseURL: "/api/v1", timeout: 12000 });

export async function getDepth(market: string) {
  const { data } = await api.get("/depth", { params: { symbol: market } });

  if (!data?.bids || !data?.asks) {
    throw new Error("Depth snapshot is empty");
  }

  return data as { bids: [string, string][]; asks: [string, string][] };
}

export async function getTicker(market: string) {
  const tickers = await getTickers();
  return tickers.find((t) => t.symbol === market) ?? null;
}

export async function getTrades(market: string, limit = 30): Promise<Trade[]> {
  const { data } = await api.get("/trades", {
    params: { symbol: market, limit },
  });
  return Array.isArray(data) ? (data as Trade[]) : [];
}

export async function getTickers(): Promise<Ticker[]> {
  const { data } = await api.get("/tickers");

  if (!Array.isArray(data)) {
    throw new Error("Unexpected tickers payload");
  }

  return data as Ticker[];
}

export async function getKlines({
  market,
  interval,
  startTime,
}: {
  market: string;
  interval: string;
  startTime: string;
  endTime?: string;
}): Promise<KLine[]> {
  const { data } = await api.get("/klines", {
    params: { symbol: market, interval, startTime },
  });

  const klines: KLine[] = Array.isArray(data) ? data : [];
  return klines.sort((x, y) => Number(x.end) - Number(y.end));
}

export async function getinfo(): Promise<marketData[]> {
  const tickers = await getTickers();
  return tickers.map(({ symbol, lastPrice, priceChangePercent }) => ({
    symbol,
    lastPrice,
    priceChangePercent,
  }));
}

/**
 * Coin metadata (name, logo, market cap) is identical for every consumer and
 * costs a ~50-coin upstream round trip, so concurrent callers share one
 * in-flight request and a short-lived result.
 */
const COIN_CACHE_MS = 30_000;
let coinCache: { at: number; data: CoinInfo[] } | null = null;
let coinInFlight: Promise<CoinInfo[]> | null = null;

export async function getAllInfo(): Promise<CoinInfo[]> {
  if (coinCache && Date.now() - coinCache.at < COIN_CACHE_MS) {
    return coinCache.data;
  }
  if (coinInFlight) return coinInFlight;

  coinInFlight = api
    .get("/coins")
    .then(({ data }) => {
      const coins: CoinInfo[] = Array.isArray(data) ? data : [];
      coinCache = { at: Date.now(), data: coins };
      return coins;
    })
    .finally(() => {
      coinInFlight = null;
    });

  return coinInFlight;
}

export async function getMarketKlines(
  startTime: number,
  endTime: number
): Promise<LineCryptoData[]> {
  const { data } = await api.get("/market-klines", {
    params: { startTime, endTime },
  });
  return Array.isArray(data) ? (data as LineCryptoData[]) : [];
}
