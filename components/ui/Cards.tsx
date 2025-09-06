// "use client"
// import { usePathname } from "next/navigation"
// import { useRouter } from "next/navigation";


// export default function Card({Heading,data}:{Heading:string,data:any}){
//     const route=usePathname();
//     const router=useRouter();

//     return <div>

//             <div className="w-50 h-[250px] bg-white">
//                 <div className="rounded-lg text-base shadow-xs w-full p-2 px-0">{Heading}</div>
//                 <div className="flex flex-col mb-2 items-baseline px-4 w-full h-full">
//                     {data && (
//                         <div className="flex flex-col p-2">
//                             {data.map((entry: any, idx: number) => (
//                                 <div 
//                                 key={idx}
//                                     className={`text-sm pt-1  justify-center pl-8 cursor-pointer  ${
//                                         route.startsWith(`${entry.symbol}`) ? 'text-white' : 'text-slate-500'
//                                     }`}
//                                     onClick={() => router.push(`/trade/${entry[0]}`)}
//                                     >
//                                     {JSON.stringify(entry[0])}
                                    
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//                     </div>
// }

