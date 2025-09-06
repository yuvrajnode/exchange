

export default function Hero(){
    return (
        <>
            <div className=" flex flex-col text-neutral-200 text-5xl tracking-wide text-center  gap-5 items-center mt-10" style={{fontFamily:"unset"}}> 
                <h1 className=" text-7xl"> Exchange you&apos;ll love</h1>
                <p className="   max-w-6xl text-center text-lg text-neutral-500">
                    Exchange make its safe and esty for you to store,buy and sell <br/>stake,crypto on ony blockchain
                </p>
                <button className="rounded-xl bg-sky-800 text-neutral-200 text-center m-5 pl-6 pr-6  pt-3 pb-3 text-[20px] font-light  tracking-tight  "> Trade</button>
            </div>
        </>
    );
}