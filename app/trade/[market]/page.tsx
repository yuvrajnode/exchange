"use client"
import { useParams } from "next/navigation"
import { Depth } from "@/components/ui/depth/Depth";
import { TradeView } from "@/components/ui/Tradeview";
import Appbar from "@/components/ui/Appbar";
import {SwapUI} from "@/components/ui/SwapUi";
import { MarketBar } from "@/components/ui/MarketBar";


export default function Page() {
    const { market } = useParams();
const number =1;
    return (
    <div className="flex flex-col h-screen font-inter lg:flex-row w-full bg-black text-white">
      <div className="flex flex-col lg:w-3/4 h-full ">
        {/* MarketBar at the top */}
         <div><Appbar TrueButton={number}/></div>
        <div className="w-full bg-blue-700/5 pl-4">
          <MarketBar market={market as string} />
        </div>

        <div className="flex flex-col lg:flex-row w-full h-full">
          {/* Left half for TradeView */}
          <div className="lg:w-2/3 flex flex-col ">
            <TradeView market={market as string} />
          </div>

          {/* <div className="border-t lg:border-t-0 lg:border-l border-neutral-800" /> */}

          {/* Right half split between Depth and SwapUI */}
          <div className="lg:w-1/3 flex flex-col lg:flex-row h-full">
            <div
              className="flex-1 p-1 overflow-auto no-scrollbar "
              style={{ maxHeight: "75vh" , maxWidth:"45vh"}}
            >
              <Depth market={market as string} />
            </div>
           {/* ÷ <div className="border-t lg:border-t-0 lg:border-l border-neutral-800" /> */}
          </div>
        </div>
        <div>
          {/* <OrderTable openOrders={openOrders} /> */}
        </div>
      </div>

      {/* SwapUI at the bottom on mobile, right on larger screens */}
      <div className="lg:w-1/4 overflow-auto lg:order-none order-last h-[550px] rounded-2xl mt-20 pt-1.5 bg-blue-300/10">
        <SwapUI market={market as string} />
      </div>
    </div>
  );
}