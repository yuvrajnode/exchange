"use server";

import { CryptoData, LineCryptoData , LineCryptoDataPoint } from "../market/page";
import { getAllInfo, getMarketKlines } from "./httpClient";

export type CombinedCryptoData = CryptoData & { KlineData?: LineCryptoDataPoint[] };

export async function CombineData() {
  try {
    const allData: CryptoData[] = await getAllInfo();
    if(!allData) {
        throw new Error('Token data not found');
    }
    const marketData: LineCryptoData[] = await getMarketKlines(
      Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000),
      Math.floor(new Date().getTime() / 1000)
    );
    if(!marketData) {
        throw new Error('Klines Data not found');
    }
    const combinedData: CombinedCryptoData[] = allData.map((data) => {
        const matchingMarketData = marketData.find((market) => market.symbol.replace('_USDC', '').toLowerCase() === data.symbol);
        return {
            ...data,
            KlineData: matchingMarketData?.data,
        };
    });

      return combinedData;

        } catch (error) {
    console.error("Error fetching data:", error);
  }
}