import { getinfo } from "@/app/utils/httpClient";
import { marketData } from "@/app/utils/types";
import { useEffect } from "react";


export function TopGainer(){

    useEffect(()=>{
        getinfo().then((data:marketData[])=>{
            const selectedData=data.sort((a: marketData,b: marketData)=> parseFloat(b.priceChangePercent) - parseFloat(a.priceChangePercent)).slice(10)

            console.log("Top gainer data:", selectedData);
         
        })
    },[])
    return <div>
        TopGainer
    </div>
}