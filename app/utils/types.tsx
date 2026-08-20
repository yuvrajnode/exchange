export interface Depth {
  bids: [string, string][];
  asks: [string, string][];
  lastUpdateId: string;
  timestamp: string;
}

export interface Ticker {
  firstPrice: string;
  high: string;
  lastPrice: string;
  low: string;
  priceChange: string;
  /** Fractional, not a percentage: 0.0699 means +6.99%. */
  priceChangePercent: string;
  quoteVolume: string;
  symbol: string;
  trades: string;
  volume: string;
}

export interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quoteVolume: string;
  start: string;
  trades: string;
  volume: string;
}

export interface marketData {
  lastPrice: string;
  symbol: string;
  priceChangePercent: string;
}

export interface Trade {
  id: number;
  price: string;
  quantity: string;
  quoteQuantity: string;
  timestamp: number;
  isBuyerMaker: boolean;
}

/** A coin as returned by the price indexer. */
export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  /** Already a percentage: 3.6 means +3.6%. */
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  last_updated: string;
}

export interface LineCryptoDataPoint {
  close: string;
  /** ISO timestamp for the end of the candle. */
  end: string;
}

export interface LineCryptoData {
  data: LineCryptoDataPoint[];
  symbol: string;
}
