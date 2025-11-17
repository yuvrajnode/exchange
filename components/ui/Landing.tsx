"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Hero from "../HeroSection";
import Advertisment from "../Advertisment";
export default function Landing(){
    const router = useRouter();
    return <>
        <div className=" flex flex-row p-4  bg-neutral-900  text-gray-400  tracking-wider   items-center rounded-2xl ml-10 mr-10 sticky-top top-10 z-0  text-md  text-lg" style={{fontFamily:"Fajalla One, sans-serif"}} >
            <div>
                    <Image src="/logo.svg" alt="logo" height={20} width={30} loading="lazy" />
            </div>
            <div className=" flex flex-1 ">
                    <ul className=" flex flex-1 gap-20 justify-center cursor-pointer ">
                        <li onClick={()=>
                            router.push("/")
                        } className="hover:text-gray-300" >Explore</li>
                        <li className="hover:text-gray-300" onClick={()=>
                            router.push("/market")
                        }>Markets</li>
                        <li className="hover:text-gray-300" onClick={()=>
                            router.push("/trade/SOL_USDT")
                        } > Trades</li>
                    </ul>
            </div>
        </div>
          <Hero/>
          <Advertisment/>
    </>
}