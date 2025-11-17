

"use client";
import { useEffect, useState } from "react";
import type { Ticker } from "../../app/utils/types";
import { getTicker } from "../../app/utils/httpClient";
import { SignalingManager } from "../../app/utils/SignalingManager";
import  Image  from "next/image";

import { getAllInfo } from "../../app/utils/httpClient";

interface CoinData {
  symbol: string;
  image: string;
}

export const MarketBar = ({market}: {market: string}) => {
    const [ticker, setTicker] = useState<Ticker | null>(null);
    // const [data, setdata]=useState<CryptoData[]>([]);
     const [tokenImage, settokenImage] = useState<string | null>(null);
     const[usdcImage,setimage]=useState<string | null >(null);
  useEffect(() => {
    //fetch the Image from getAllInfo
    async function fetchImage() {
      try {
        const data: CoinData[] = await getAllInfo();
        const image = data.find(
          (d: CoinData) =>
            d.symbol.toLowerCase() === market.split("_")[0].toLowerCase()
        )?.image;
        settokenImage(image || null);
        setimage(
          data.find((d: CoinData) => d.symbol.toLowerCase() === "usdc")?.image ||
            null
        );
      } catch (error) {
        console.error("Failed to fetch token images:", error);
      }
    }
    fetchImage();
  }, [market]);


    useEffect(() => {
        let cancelled = false;
        const subscriptionKey = `TICKER-${market}`;
        getTicker(market)
          .then((result) => {
            if (!cancelled && result) {
              setTicker(result);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch ticker snapshot:", error);
          });
        SignalingManager.getInstance().registerCallback("ticker",(data: unknown)=>{

            const tickerData = data as Ticker;
            setTicker((prevTicker) => ({
                firstPrice: tickerData?.firstPrice ?? prevTicker?.firstPrice ?? '',
                high: tickerData?.high ?? prevTicker?.high ?? '',
                lastPrice: tickerData?.lastPrice ?? prevTicker?.lastPrice ?? '',
                low: tickerData?.low ?? prevTicker?.low ?? '',
                priceChange: tickerData?.priceChange ?? prevTicker?.priceChange ?? '',
                priceChangePercent: tickerData?.priceChangePercent ?? prevTicker?.priceChangePercent ?? '',
                quoteVolume: tickerData?.quoteVolume ?? prevTicker?.quoteVolume ?? '',
                symbol: tickerData?.symbol ?? prevTicker?.symbol ?? '',
                trades: tickerData?.trades ?? prevTicker?.trades ?? '',
                volume: tickerData?.volume ?? prevTicker?.volume ?? '',
            }))
        },subscriptionKey)

    SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`ticker.${market}`]});

    return () => {
        cancelled = true;
        SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE","params":[`ticker.${market}`]});
        SignalingManager.getInstance().deRegisterCallback("ticker",subscriptionKey);
    }
        
    }, [market])

    
    // 

    return <div>
        <div className="flex items-center  flex-row relative w-[780px] overflow-hidden h-full border-slate-800">
            <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
                    <Ticker market={market} TokenImage={tokenImage ?? ""} image={usdcImage ?? ""}/>
                    <div className="flex items-center flex-row space-x-8 pl-4">
                        <div className="flex flex-col h-full justify-center">
                            <p className={`font-medium tabular-nums text-greenText text-md text-green-500`}>${ticker?.lastPrice}</p>
                            <p className="font-medium   tabular-nums">${ticker?.lastPrice}</p>
                        </div>
                        <div className="flex flex-col">
                            <p className={`font-medium text-xs text-slate-400`}>24H Change</p>
                            <p className={`  font-medium tabular-nums leading-5  text-greenText ${Number(ticker?.priceChange) > 0 ? "text-green-500" : "text-red-500"}`}>{Number(ticker?.priceChange) > 0 ? "+" : ""} {ticker?.priceChange} {Number(ticker?.priceChangePercent)?.toFixed(2)}%</p></div><div className="flex flex-col">
                                <p className="font-medium text-xs text-slate-400 ">24H High</p>
                                <p className=" font-medium tabular-nums leading-5  ">{ticker?.high}</p>
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-medium text-xs text-slate-400 ">24H Low</p>
                                    <p className=" font-medium tabular-nums leading-5 ">{ticker?.low}</p>
                                </div>
                            <button type="button" className="font-medium transition-opacity hover:opacity-80 hover:cursor-pointer text-base text-left" data-rac="">
                                <div className="flex flex-col">
                                    <p className="font-medium text-xs text-slate-400 ">24H Volume</p>
                                    <p className="mt-1  font-medium tabular-nums leading-5  ">{ticker?.volume}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>

}

function Ticker({market,TokenImage, image}: {market: string,TokenImage:string,image:string}) {
    return <div className="flex h-[60px] shrink-0 space-x-4">
        <div className="flex flex-row relative ml-2 -mr-4">
             <Image
          src={market === "TATA_INR" ? "/TATA.png" : TokenImage || "/sol copy.webp"}
          alt="Market Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          width={30}
          height={30}
          className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
        />
              <Image
          src={image}
          alt="Market Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          width={30}
          height={30}
          className="z-2 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
        />
           
        </div>
    <button type="button" className="react-aria-Button" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
            <div className="flex items-center flex-row gap-2 undefined">
                <div className="flex flex-row relative">
                    <p className="font-medium text-sm undefined">{market.replace("_", " / ")}</p>
                </div>
            </div>
        </div>
    </button>
    </div>
}

