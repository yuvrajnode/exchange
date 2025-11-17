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
                 SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE" ,"params":[`depth.200ms.${market}`]});
                 SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            }
        },[market]);
    

        return <div className="bg-black  border-gray-500 border-b-4 rounded-2xl ">
              <TableHeader />
            {asks  && <AskTable asks={asks} ></AskTable>}
             {price && <div className="text-green-400">{price}</div>}
            { bids && <Bidstable bids={bids} ></Bidstable>}

        </div>
}

function TableHeader(){
    return <div className="flex flex-row flex-1 justify-around text-high-emphasis font-medium truncate  text-xm font-sans ">
        <div className="text-white">Price(USD)</div>
        <div className="text-neutral-300">Size</div>
        <div className="text-shadow-neutral-300">Total</div>
    </div>
}