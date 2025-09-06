"use client";

import { usePathname } from "next/navigation";
import { PrimaryButton, SuccessButton } from "@/components/ui//core/button"
import { useRouter } from "next/navigation";

export default function  Appbar  ({TrueButton} :{TrueButton: number}) {
    const route = usePathname();
    const router = useRouter()

    return <div className="text-slate-500 border-white border- mb-5 p-5  bg-blue-900/10">
        <div className="flex justify-between items-center p-2">
            <div className="flex space-x-20">
                <div className={`text-xl pl-4 flex flex-col justify-center cursor-pointer  text-white ` } onClick={() => router.push('/')}>
                    Exchange
                </div>
                <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer hover:text-white ${route.startsWith('/markets') ? 'text-white' : 'text-slate-500'}`} onClick={() => router.push('/market')}>
                    Markets
                </div>
                <div className={`text-sm pt-1 flex flex-col justify-center pl-8 cursor-pointer hover:text-white` } onClick={() => router.push('/trade/SOL_USDC')}>
                   Explore Trade
                </div>
            </div>
            {TrueButton==1?(<Button/>):(null)}
        </div>
    </div>
}

function Button(){
    return    <div className="flex">
                <div className=" mx-10 p-2 mr-2">
                   <SuccessButton>Deposit</SuccessButton> 
                    <PrimaryButton>Withdraw</PrimaryButton>
                </div>
            </div>
}