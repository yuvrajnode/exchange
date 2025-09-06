export interface Depth {
    bids: [string, string][],
    asks: [string, string][],
    lastUpdateId: string,
    timestamp:string
}
export interface Ticker {
     "firstPrice": string,
    "high": string,
    "lastPrice": string,
    "low": string,
    "priceChange": string,
    "priceChangePercent": string,
    "quoteVolume": string,
    "symbol": string,
    "trades": string,
    "volume": string
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

export interface marketData{
    
  lastPrice:string,
  symbol:string,
  priceChangePercent:string

}