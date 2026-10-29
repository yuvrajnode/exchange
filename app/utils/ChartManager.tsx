import {
  CandlestickSeries,
  ColorType,
  createChart as createLightWeightChart,
  CrosshairMode,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";

export class ChartManager {
  private chart: IChartApi;

  constructor(
    ref: HTMLElement,
    initialData: { timestamp: number; open: number; high: number; low: number; close: number; volume?: number }[],
    layout: { background: string; color: string },
    /** Decimal places on the price axis; the library default of 2 flattens sub-cent markets. */
    precision = 2
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

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26c08a",
      downColor: "#f0546b",
      borderVisible: false,
      wickUpColor: "#26c08a",
      wickDownColor: "#f0546b",
      priceFormat: {
        type: "price",
        precision,
        minMove: 10 ** -precision,
      },
    });

    candleSeries.setData(
      initialData.map((data) => ({
        ...data,
        time: (data.timestamp / 1000) as UTCTimestamp,
      }))
    );

    chart.timeScale().fitContent();
  }

  public destroy() {
    this.chart.remove();
  }
}
