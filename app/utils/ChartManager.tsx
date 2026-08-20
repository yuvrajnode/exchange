import {
  CandlestickSeries,
  CandlestickSeriesPartialOptions,
  ColorType,
  createChart as createLightWeightChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
} from "lightweight-charts";

export class ChartManager {
  private candleSeries: ISeriesApi<"Candlestick">;
  private lastUpdateTime: number = 0;
  private chart: IChartApi;
  private currentBar: {
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
  } = {
    open: null,
    high: null,
    low: null,
    close: null,
  };



  constructor(
    ref: HTMLElement,
    initialData: { timestamp: number; open: number; high: number; low: number; close: number; volume?: number }[],
    layout: { background: string; color: string }
  ) {
    if (typeof window === "undefined") {
      throw new Error("ChartManager must be instantiated in the browser");
    }

    const chart = createLightWeightChart(ref, {
      autoSize: true,
      overlayPriceScales: {
        ticksVisible: true,
        borderVisible: true,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        visible: true,
        ticksVisible: true,
        entireTextOnly: true,
        borderColor: "#1e252f",
      },
      // Faint gridlines give the eye a price/time reference without
      // competing with the candles.
      grid: {
        horzLines: { color: "rgba(148, 157, 172, 0.07)" },
        vertLines: { color: "rgba(148, 157, 172, 0.05)" },
      },
      timeScale: {
        borderColor: "#1e252f",
        timeVisible: true,
      },
      layout: {
        background: {
          type: ColorType.Solid,
          color: layout.background,
        },
        textColor: layout.color,
        fontFamily:
          "var(--font-geist-mono), ui-monospace, SF Mono, monospace",
        attributionLogo: false,
      },
    });
    this.chart = chart;

    const seriesOptions: CandlestickSeriesPartialOptions = {
      upColor: "#26c08a",
      downColor: "#f0546b",
      borderVisible: false,
      wickUpColor: "#26c08a",
      wickDownColor: "#f0546b",
    };

    // lightweight-charts v5 uses addSeries instead of addCandlestickSeries.
    if ("addCandlestickSeries" in chart) {
      // @ts-expect-error - legacy signature is still valid at runtime
      this.candleSeries = chart.addCandlestickSeries(seriesOptions);
    } else {
      this.candleSeries = chart.addSeries(CandlestickSeries, seriesOptions);
    }

    this.candleSeries.setData(
      initialData.map((data) => ({
        ...data,
        time: (data.timestamp / 1000) as UTCTimestamp,
      }))
    );

    chart.timeScale().fitContent();
  }


  public update(updatedPrice: { close: number; low: number; high: number; open: number; newCandleInitiated?: boolean; time?: number }) {
    if (!this.lastUpdateTime) {
      this.lastUpdateTime = new Date().getTime();
    }

    this.candleSeries.update({
      time: (this.lastUpdateTime / 1000) as UTCTimestamp,
      close: updatedPrice.close,
      low: updatedPrice.low,
      high: updatedPrice.high,
      open: updatedPrice.open,
    });

    if (updatedPrice.newCandleInitiated && updatedPrice.time) {
      this.lastUpdateTime = updatedPrice.time;
    }
  }



  public destroy() {
    this.chart.remove();
  }
}