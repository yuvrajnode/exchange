import { getinfo } from "@/app/utils/httpClient";
import { marketData } from "@/app/utils/types"
import { useEffect } from "react"


export default function NewTable(){

    useEffect(()=>{

        getinfo().then((data:marketData[])=>{
                 const size=data.length;

                const selected_Data:marketData[] = data.slice(size - 10, size);

                console.log("New table data:", selected_Data);
        })
        
    },[])
   
    return <div>
        
    </div>
}