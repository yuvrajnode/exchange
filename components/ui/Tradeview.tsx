import { useEffect, useRef, useCallback } from "react";
import { ChartManager } from "../../app/utils/ChartManager";
import { getKlines } from "../../app/utils/httpClient";
import { KLine } from "../../app/utils/types";



export function TradeView({ market}:{ market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<ChartManager>(null);
  const init = useCallback(async () => {
    let klineData: KLine[] = [];
    try {
      const interval="1h";
      const startTime=String(Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000));
      const endTime=String(Math.floor(new Date().getTime() / 1000));
      klineData = await getKlines({market,interval,startTime , endTime }); 

    } catch (e) { return e}

    if (chartRef.current) {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }
      const chartManager = new ChartManager(
        chartRef.current,
        [
          ...klineData?.map((x) => ({
            close: parseFloat(x.close),
            high: parseFloat(x.high),
            low: parseFloat(x.low),
            open: parseFloat(x.open),
            timestamp: new Date(x.end).getTime(), 
          })),
        ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
        {
          background: "#0e0f14",
          color: "white",
        }
      );
      chartManagerRef.current = chartManager;
    }
  }, [market]);

  useEffect(() => {
      init();
  }, [market, chartRef, init]);

  return (
    <>
      <div ref={chartRef} style={{ height: "520px", width: "98%", marginTop: 4 }}></div>
    </>
  );
}