"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ColorType,
  createChart,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";
import {
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { CombineData, CombinedCryptoData } from "../utils/combine-data";
import { useEffect,useRef,useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Appbar from "@/components/ui/Appbar";


export interface CurrencyData {
  price: number;
  market_cap: number;
  price_change_percentage_24hr: number;
  volume: number;
}

export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // Use Date if you parse it as a Date object
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // Use Date if you parse it as a Date object
  roi: null | number;
  last_updated: string; // Use Date if you parse it as a Date object
  price_change_percentage_24h_in_currency: number;
  currencies: {
    cad: CurrencyData;
    cny: CurrencyData;
    eur: CurrencyData;
    gbp: CurrencyData;
    jpy: CurrencyData;
    usd: CurrencyData;
  };
}

export interface LineCryptoDataPoint {
  close: string;
  end: string; //THIS IS TIME
}

export interface LineCryptoData {
  data: LineCryptoDataPoint[];
  symbol: string;
}

export default function Component() {
  const [data, setData] = useState<CombinedCryptoData[] | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = (await CombineData()) ?? null;
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // Initial fetch
    fetchData();
    // Poll every 10 seconds
    const interval = setInterval(fetchData, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!data) {
    return (
      <div className="bg-[#121212] text-white min-h-screen p-4 tracking-widest">
          <div className="max-w-7xl mx-auto">
              {/* Carousel Skeleton */}
              <div className="relative bg-blue-900/10 rounded-xl w-full  overflow-hidden mb-6 h-80">
                  <div className="p-8 space-y-4  absolute  bottom-1">
                      <Skeleton className="h-10 w-full bg-neutral-700" />
                      <Skeleton className="h-6 w-1/2 bg-neutral-700" />
                      <div className="flex space-x-4">
                          <Skeleton className="h-10 w-32 rounded-lg bg-neutral-700" />
                          <Skeleton className="h-10 w-32 rounded-lg bg-neutral-700" />
                      </div>
                  </div>
              </div>

              {/* Three Column Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map((index) => (
                      <div key={index} className="bg-blue-900/10 p-4 rounded-xl">
                          <Skeleton className="h-8 w-32 mb-4 bg-neutral-700" />
                          <div className="space-y-4">
                              {[1, 2, 3, 4, 5].map((item) => (
                                  <div key={item} className="flex items-center justify-between p-2">
                                      <div className="flex items-center gap-3">
                                          <Skeleton className="h-8 w-8 rounded-full bg-neutral-700" />
                                          <div className="space-y-2">
                                              <Skeleton className="h-4 w-24 bg-neutral-700" />
                                              <Skeleton className="h-3 w-16 bg-neutral-700" />
                                          </div>
                                      </div>
                                      <div className="space-y-2">
                                          <Skeleton className="h-4 w-20 bg-neutral-700" />
                                          <Skeleton className="h-3 w-16 bg-neutral-700" />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>

              {/* Table Skeleton */}
              <div className="bg-blue-900/10 p-4 rounded-xl">
                  <div className="flex space-x-4 mb-4">
                      <Skeleton className="h-8 w-20 bg-neutral-700" />
                      <Skeleton className="h-8 w-20 bg-neutral-700" />
                  </div>
                  <div className="space-y-4">
                      {/* Table Header */}
                      <div className="grid grid-cols-6 gap-4 pb-4 border-b border-neutral-800">
                          {[1, 2, 3, 4, 5, 6].map((item) => (
                              <Skeleton key={item} className="h-6 bg-neutral-700" />
                          ))}
                      </div>
                      {/* Table Rows */}
                      {[1, 2, 3, 4, 5].map((row) => (
                          <div key={row} className="grid grid-cols-6 gap-4 py-4">
                              <div className="flex items-center gap-3">
                                  <Skeleton className="h-12 w-12 rounded-full bg-neutral-700" />
                                  <div className="space-y-2">
                                      <Skeleton className="h-4 w-24 bg-neutral-700" />
                                      <Skeleton className="h-3 w-16 bg-neutral-700" />
                                  </div>
                              </div>
                              {[1, 2, 3, 4, 5].map((col) => (
                                  <Skeleton key={col} className="h-6 bg-neutral-700" />
                              ))}
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
  )
  };

  const getNewListings = (data: CryptoData[]): CryptoData[] => {
    return data
      .sort((a, b) => 
        new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
      )
      .slice(0, 5);
  };
  
  // Function to get top gainers (middle panel)
  const getTopGainers = (data: CryptoData[]): CryptoData[] => {
    return data
      .filter(coin => !Number.isNaN(coin.price_change_percentage_24h))
      .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
      .slice(0, 5);
  };
  
  // Function to get popular coins (right panel)
  const getPopularCoins = (data: CryptoData[]): CryptoData[] => {
    // Based on the image, we should prioritize major coins like BTC, ETH, SOL
    const popularSymbols = ['SOL', 'ETH', 'BTC', 'WEN', 'DRIFT'];
    
    return data
      .filter(coin => popularSymbols.includes(coin.symbol.toUpperCase()))
      .sort((a, b) => {
        const aIndex = popularSymbols.indexOf(a.symbol.toUpperCase());
        const bIndex = popularSymbols.indexOf(b.symbol.toUpperCase());
        return aIndex - bIndex;
      });
  };
  
  
  

  // Sorting for most popular based on market cap rank (descending)
  const mostPopular = getPopularCoins(data);

  // Sorting for top gainer based on 24h price change percentage (descending)
  const topGainer = getTopGainers(data);

  // Finding newest entry based on `last_updated` (you may also use createdAt if available)
  const newEntries = getNewListings(data);
const number=0;
  return (
    <div className="bg-[#121212] font-inter text-white min-h-screen p-4 tracking-widest">
      <div className="max-w-7xl mx-auto">
         <Appbar  TrueButton={number}></Appbar>
       
        <Carousel />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div 
            className="bg-neutral-900/50 cursor-pointer  p-6 rounded-xl flex items-center gap-6 "
            transition={{ duration: 0.2 }}
            onClick={() => window.location.href = "/trade/TATA_INR"}
          >
            <div className="p-4 bg-purple-500/10 rounded-full">
              <div className="relative">
          <TrendingUp className="w-8 h-8 text-purple-500" />
          <motion.div 
            className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold mb-1">TATA/INR Market</h3>
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">HOT</span>
              </div>
              <p className="text-neutral-400">Trading at ₹500 • Volume: ₹1.2M</p>
              <div className="flex items-center gap-2 mt-1">
          <span className="text-green-500">+12.5%</span>
          <span className="text-xs text-neutral-400">(24h)</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="bg-neutral-900/50 cursor-pointer  p-6 rounded-xl flex items-center gap-6"
            transition={{ duration: 0.2 }}
            onClick={() => window.location.href = "/trade/TATA_INR"}
          >
            <div className="p-4 bg-blue-500/10 rounded-full">
              <svg 
          className="w-8 h-8 text-blue-500"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
              >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Market Overview</h3>
              <p className="text-neutral-400">TATA/INR leads with highest volume</p>
              <div className="mt-1 text-xs text-neutral-400">
          Updated 2 mins ago
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-900/10  p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">New</h2>
            <CryptoList items={newEntries} />
          </div>

          <div className="bg-blue-900/10  p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Top Gainers</h2>
            <CryptoList items={topGainer} />
          </div>

          <div className="bg-blue-900/10  p-4 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Popular</h2>
            <CryptoList items={mostPopular} />
          </div>
        </div>

        <div className="bg-neutral-900/10 p-4 rounded-xl">
            <div className="flex space-x-4 mb-4">
            <motion.button
              className="px-4 py-2 text-white bg-neutral-800/50 rounded-lg font-medium border border-neutral-700"
              whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
              transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Spot
            </motion.button>
            <motion.button
              className="px-4 py-2 text-neutral-400 rounded-lg font-medium hover:text-white"
              whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.05)",
              transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Favorites
            </motion.button>
            </div>
          <CryptoTable data={data} />
        </div>
      </div>
    </div>
  );
}

// lib/utils.ts
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

function CryptoList({ items }: { items: CryptoData[] }) {
  return (
    <motion.ul className="space-y-2 tracking-wider">
      {items.map((crypto, index) => (
        <motion.li
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.3,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          whileHover={{ 
            scale: 1.02,
            backgroundColor: "rgba(255, 255, 255, 0.05)"
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() =>
            (window.location.href = `/trade/${crypto.symbol.toUpperCase()}_USDC`)
          }
          key={crypto.id}
          className="py-1 cursor-pointer rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between px-4">
            <motion.div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 overflow-hidden rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                <Image
                width={25}
                height={25}
                  src={crypto.image}
                  alt={crypto.symbol}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h3 className="font-medium uppercase">{crypto.symbol}</h3>
              </div>
            </motion.div>

            <motion.div className="flex items-center gap-6">
              <div className="text-right">
              <div className="font-medium">
                {formatCurrency(crypto.current_price)}
              </div>
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className={`flex justify-end gap-1 text-sm ${
                crypto.price_change_percentage_24h >= 0
                  ? "text-green-600"
                  : "text-red-600"
                }`}
              >
                {crypto.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="w-4 h-4" />
                ) : (
                <TrendingDown className="w-4 h-4" />
                )}
                {formatPercentage(crypto.price_change_percentage_24h)}
              </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

interface CryptoTableRowProps {
  name: string;
  image: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume: number;
  change: number;
  klineData: LineCryptoDataPoint[] | undefined;
}

function CryptoTable({ data }: { data: CombinedCryptoData[] | null }) {
  if (!data) return null;
  return (
    <table className="w-full">
      <thead>
        <tr className="text-neutral-400 text-md border-b border-neutral-800">
          <th className="text-left pl-4  font-normal  tracking-wide pb-4">
            Name
          </th>
          <th className="text-right font-normal  tracking-wide pb-4">Price</th>
          <th className="text-right font-normal  tracking-wide pb-4">
            ↓Market Cap
          </th>
          <th className="text-right font-normal  tracking-wide pb-4">
            24h Volume
          </th>
          <th className="text-right font-normal  tracking-wide pb-4">
            24h Change
          </th>
          <th className="text-right font-normal  tracking-wide pb-4">
            Last 7 Days
          </th>
        </tr>
      </thead>
      <tbody className="">
        {data
          ?.sort((a, b) => b.market_cap - a.market_cap)
          .slice(0, -5)
          .filter((item) => !item.symbol.toLowerCase().includes("usdc"))
          .map((item, index) => {
            //Now we have to Take each Item and Match the data from the Table and then
            // const data = dataKlines?.find((data:any) => data.symbol === item.symbol);
            // if (!data) return null;

            return (
              <CryptoTableRow
                key={index}
                image={item.image}
                name={item.name}
                symbol={item.symbol}
                price={item.current_price}
                marketCap={item.market_cap}
                volume={item.total_volume}
                change={item.price_change_percentage_24h}
                klineData={item.KlineData}
              />
            );
          })}
      </tbody>
    </table>
  );
}

function CryptoTableRow({
  name,
  image,
  symbol,
  price,
  marketCap,
  volume,
  change,
  klineData,
}: CryptoTableRowProps) {
  function formatNumber(value: number) {
    if (value >= 1e12) {
      return (value / 1e12).toFixed(2) + "T";
    } else if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + "B";
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + "M";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + "K";
    } else {
      return value;
    }
  }

  return (
    <motion.tr
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      className="border-b border-neutral-800 p-3 group font-medium text-lg hover:rounded-xl transition-all cursor-pointer"
      onClick={() =>
        (window.location.href = `/trade/${symbol.toUpperCase()}_USDC`)
      }
    >
      <td className="py-4 pl-2 flex items-center first:rounded-l-xl last:rounded-r-xl">
        <motion.div 
          whileHover={{ scale: 1.1 }}
          className="bg-neutral-700 rounded-full mr-5"
        >
            
          <Image
            src={image}
            alt={symbol}
            width={54}
            height={54}
            className="rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>{name}</div>
          <div className="text-neutral-400 text-sm">{symbol.toUpperCase()}</div>
        </motion.div>
      </td>
      <motion.td 
        className="text-right py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        ${price}
      </motion.td>
      <motion.td 
        className="text-right py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        ${formatNumber(marketCap)}
      </motion.td>
      <motion.td 
        className="text-right py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        ${formatNumber(volume)}
      </motion.td>
      <motion.td
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className={`text-right py-4 ${
          change > 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {change} %
      </motion.td>
      <motion.td 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-left px-4 text-green-600 flex justify-end items-center last:rounded-r-xl"
      >
        <CryptoLineChart
          data={klineData ?? []}
          color={change > 0 ? "#34D399" : "#DC2626"}
        />

        {change<0?(<TrendingDown color="red"/>) : (<TrendingUp></TrendingUp>)}
      </motion.td>
    </motion.tr>
  );
}

const carouselItems = [
  {
    src: "/backpack-smoke copy.webp",
    title: "US Election Prediction Markets",
    description: "Predict the outcome by trading the outcome tokens.",
    buttons: [{ text: "Manage Referrals", link: "#" }],
  },
  {
    src: "/trumpharris copy.webp",
    title: "Another Market",
    description: "Trade the outcome tokens for another market.",
    buttons: [
      { text: "Trade TRUMPWIN", link: "#" },
      { text: "Trade KAMALAWIN", link: "#" },
    ],
  },
  {
    src: "/home-banner copy.webp",
    title: "Yet Another Market",
    description: "Trade the outcome tokens for yet another market.",
    buttons: [{ text: "Trade Now", link: "#" }],
  },
];

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 7000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
      },
    }),
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <div className="relative bg-[#1c1c1c] rounded-xl overflow-hidden mb-6 pt-32">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
        >
          <Image
            src={currentItem.src}
            alt="Background"
            layout="fill"
            objectFit="cover"
            className="opacity-70"
          />
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="relative p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4 px-2 md:px-4">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2"
          >
            <ChevronLeft
              className="text-neutral-400 cursor-pointer w-6 h-6 md:w-8 md:h-8"
              onClick={handlePrev}
            />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2"
          >
            <ChevronRight
              className="text-neutral-400 cursor-pointer w-6 h-6 md:w-8 md:h-8"
              onClick={handleNext}
            />
          </motion.div>
        </div>

        <motion.h1
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {currentItem.title}
        </motion.h1>

        <motion.p
          className="text-neutral-400 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {currentItem.description}
        </motion.p>

        <div className="flex space-x-4">
          {currentItem.buttons.map((button, index) => (
            <motion.button
              key={index}
              className="bg-white tracking-normal font-semibold text-black px-6 py-2 rounded-lg"
              whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {button.text}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center mt-4 space-x-2">
          {carouselItems.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-neutral-600"
              }`}
              initial={false}
              animate={{
                scale: index === currentIndex ? 1.2 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

//-----------------

const formatData = (data: LineCryptoDataPoint[]) => {
  return data.map((point) => ({
    time: (new Date(point.end).getTime() / 1000) as UTCTimestamp,
    value: parseFloat(point.close),
  }));
};

const CryptoLineChart = ({ data, color }: {data: LineCryptoDataPoint[], color: string}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef<IChartApi | null>(null);

  const formattedData = useMemo(() => formatData(data), [data]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 30,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#14161f",
      },
      // watermark: {
      //   visible: false,
      // },
      rightPriceScale: {
        visible: false,
      },
      timeScale: {
        visible: false,
        borderVisible: false,
      },
      grid: {
        horzLines: { visible: false },
        vertLines: { visible: false },
      },
      crosshair: {
        vertLine: { visible: false },
        horzLine: { visible: false },
        // interaction: {
        //   hover: false,
        //   touch: false,
        // },
      },
      handleScroll: false,
      handleScale: false,
    });

    chart.priceScale("right").applyOptions({
      borderVisible: false,
    });

    // const lineSeries = chart.addSeries({
    //   color: color as string,
    //   lineWidth: 2,
    //   lastValueVisible: false, // Hide the value at the end of the line
    //   priceLineVisible: false, // Hide the price line
    // });
    

    // lineSeries.setData(formattedData);

    chartRef.current = chart;

    return () => {
      chart.remove();
    };
  }, [formattedData, color]);

  if (!data)
    return (
      <div className="w-40 bg-[#1E1E1E]">
        <div />
      </div>
    );

  return (
    <div className="w-28 bg-transparent">
      <div ref={chartContainerRef} />
    </div>
  );
};



// Remove this unused image function, as it is not needed.