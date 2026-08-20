import { useEffect, useState } from "react";
import {getDepth,getTicker} from '@/app/utils/httpClient'
import {AskTable} from "./AsksTable"
import Bidstable from './Bidstable'
import { SignalingManager } from "@/app/utils/SignalingManager";

interface DepthData {
    bids: [string, string][];
    asks: [string, string][];
}

export function Depth({market }:{market:string}){
    const [asks,setasks]=useState<[string,string][]>();
    const [bids,setbids]=useState<[string,string][]>();
    const [price,setprice]=useState<string>();


    useEffect(() => {
        
       
        SignalingManager.getInstance().registerCallback("depth",(data: unknown) => {
            const depthData = data as DepthData;
            setbids((originalbids) => {
                const bidsAfterUpdate = [...(originalbids || [])];
                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < depthData.bids.length; j++) {
                        if (bidsAfterUpdate[i][0] === depthData.bids[j][0]) {
                            bidsAfterUpdate[i][1] = depthData.bids[j][1];
                            break;
                        }
                    }
                }
                return bidsAfterUpdate;
            });

            setasks((originalAsk) => {
                const AskAfterUpdate = [ ...(originalAsk || []) ];
                for (let i=0;i<AskAfterUpdate.length;i++)
                {
                    for(let j=0;j<depthData.asks.length ;j++){
                        if(AskAfterUpdate[i][0]===depthData.asks[j][0]){
                            AskAfterUpdate[i][1]=depthData.asks[j][1];
                            break;
                        }
                    }
                }
                return AskAfterUpdate;
            });
        },`DEPTH-${market}`);
   SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});

        getDepth(market)
          .then((d) => {
            setbids(d.bids.reverse());
            setasks(d.asks);
          })
          .catch((error) => {
            console.error("Failed to fetch depth:", error);
          });

        getTicker(market)
          .then((t) => {
            if (t?.lastPrice) {
              setprice(t.lastPrice);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch ticker:", error);
          });

            return ()=>{
                 SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE" ,"params":[`depth.${market}`]});
                 SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            }
        },[market]);
    

        return <div className="flex h-full flex-col">
              <div className="mb-2 text-sm font-semibold text-white">Order Book</div>
              <TableHeader />
            {asks  && <AskTable asks={asks} ></AskTable>}
             {price && (
               <div className="my-1 rounded-md bg-white/5 px-2 py-1 text-center text-sm font-bold text-emerald-400 tabular-nums">
                 {price}
               </div>
             )}
            { bids && <Bidstable bids={bids} ></Bidstable>}

        </div>
}

function TableHeader(){
    return <div className="mb-1 flex flex-row justify-between border-b border-white/10 pb-1 text-[11px] font-medium uppercase tracking-wider text-neutral-500">
        <div>Price</div>
        <div>Size</div>
        <div>Total</div>
    </div>
}