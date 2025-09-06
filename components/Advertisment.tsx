import Image from "next/image"

export default function Advertisment(){
    return <>
     <div className=" flex  items-center justify-center  text-neutral-300 font-medium ">
            <div className="bg-blue-700 h-110 w-180  rounded-2xl flex flex-row items-center gap-10 p-3">
                <div className=""> <Image src={"/advertise.png"} alt="advertisement" width={230} height={200} className="rounded-3xl"></Image></div>
            <div className="flex flex-col gap-2 text-neutral-400">

                <h1 className=" h-full mb-6 text-5xl  text-neutral-300 ">
                    Turn your money <br/>into real crypto
                </h1>
                <p className="hover:text-neutral-300">Buy & Sell</p>
                <p  className="hover:text-neutral-300">Swap Token</p>
                <p  className="hover:text-neutral-300"> Real time monetring</p>
            </div>
            </div>
     </div>

    </>
}