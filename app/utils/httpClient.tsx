
import axios from "axios";
import { KLine, Ticker, marketData } from "./types";

const API_PREFIX = "/api/v1";

const api = axios.create({
  baseURL: API_PREFIX,
});

export async function getDepth(market: string) {
  const response = await api.get("/depth", {
    params: { symbol: market },
  });

  if (!response.data) {
    throw new Error("Depth snapshot is empty");
  }

  return response.data;
}

export async function getTicker(market: string) {
  const tickers = await getTickers();
  return tickers.find((t: Ticker) => t.symbol === market) ?? null;
}

export async function getTickers() {
  const response = await api.get("/tickers");

  if (!Array.isArray(response.data)) {
    throw new Error("Unexpected tickers payload");
  }

  return response.data as Ticker[];
}

export async function getKlines({
  market,
  interval,
  startTime,
  endTime,
}: {
  market: string;
  interval: string;
  startTime: string;
  endTime: string;
}) {
  const response = await api.get("/klines", {
    params: {
      symbol: market,
      interval,
      startTime,
      endTime,
    },
  });

  const data: KLine[] = Array.isArray(response.data) ? response.data : [];

  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getinfo(): Promise<marketData[]> {
  const response = await api.get("/tickers");

  if (!Array.isArray(response.data)) {
    return [];
  }

  const usefuldata: marketData[] = response.data.map(
    ({ symbol, lastPrice, priceChangePercent }: marketData) => ({
      symbol,
      lastPrice,
      priceChangePercent,
    })
  );

  return usefuldata;
}

export async function getMarketKlines(startTime: number, endTime: number) {
  try {
    const response = await fetch(
      `https://api.backpack.exchange/wapi/v1/marketDataKlines?interval=6h&startTime=${startTime}&endTime=${endTime}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

export async function getAllInfo() {
  try {
    const response = await fetch(
      "https://price-indexer.workers.madlads.com/?ids=solana,usd-coin,pyth-network,jito-governance-token,tether,bonk,helium,helium-mobile,bitcoin,ethereum,dogwifcoin,jupiter-exchange-solana,parcl,render-token,tensor,wormhole,wen-4,cat-in-a-dogs-world,book-of-meme,raydium,hivemapper,kamino,drift-protocol,nyan,jeo-boden,habibi-sol,io,zeta,mother-iggy,sanctum-2,moo-deng,debridge,shuffle-2,pepe,shiba-inu,chainlink,uniswap,ondo-finance,holograph,starknet,matic-network,mon-protocol,blur,worldcoin-wld,polyhedra-network,unagi-token,layerzero,aave,lido-dao,matr1x,polygon-ecosystem-token"
    ); // Make sure it's relative path
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`); // Handle errors
    }
    const data = await response.json(); // Parse the JSON response
    return data; // Return the data if needed
  } catch (error) {
    console.error("Error fetching data:", error); // Handle fetch errors
    throw error;
  }
}
