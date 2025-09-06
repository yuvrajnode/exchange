import { getinfo } from "@/app/utils/httpClient";
import { useEffect } from "react"
import { marketData } from "@/app/utils/types";


export default function PopularTable(){

        useEffect(() => {
            getinfo()
                .then((data: marketData[]) => {
                    const selected_data = data
                        .sort((a, b) => Number(b.lastPrice) - Number(a.lastPrice))
                        .slice(0, 10);
                     
                    console.log("Popular data:", selected_data);
                })
                .catch((error: Error) => {
                    console.error("Failed to fetch popular data:", error);
                });
        }, []);
        
        
        return <div>
        <div>
        
        </div>
    </div>
}