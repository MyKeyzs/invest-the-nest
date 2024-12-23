import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
} from "lightweight-charts";
import axios from "axios";

const FiscalOverviewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const legendContainerRef = useRef<HTMLDivElement | null>(null);

  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const seriesRefs = useRef<{ [key: string]: ISeriesApi<"Line"> }>({});
  const latestData = useRef<{ [key: string]: { value: number; time: number } }>(
    {}
  );

  const API_KEY = "w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX";

  const tickers = [
    { symbol: "XLC", color: "rgb(239, 83, 80)", sector: "Communications Services" },
    { symbol: "XLY", color: "rgb(124, 179, 66)", sector: "Consumer Discretionary" },
    { symbol: "XLP", color: "rgb(255, 202, 40)", sector: "Consumer Staples" },
    { symbol: "XLE", color: "rgb(126, 87, 194)", sector: "Energy" },
    { symbol: "XLF", color: "rgb(0, 188, 212)", sector: "Financials" },
    { symbol: "XLV", color: "rgb(255, 87, 34)", sector: "Health Care" },
    { symbol: "XLI", color: "rgb(171, 71, 188)", sector: "Industrials" },
    { symbol: "XLB", color: "rgb(76, 175, 80)", sector: "Materials" },
    { symbol: "XLRE", color: "rgb(156, 39, 176)", sector: "Real Estate" },
    { symbol: "XLK", color: "rgb(255, 235, 59)", sector: "Technology" },
    { symbol: "XLU", color: "rgb(33, 150, 243)", sector: "Utilities" },
  ];

  const fetchTickerData = async (
    ticker: string,
    lineSeries: ISeriesApi<"Line">
  ) => {
    try {
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      const formattedToday = today.toISOString().split("T")[0];
      const formattedOneYearAgo = oneYearAgo.toISOString().split("T")[0];

      const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedOneYearAgo}/${formattedToday}`,
        {
          params: {
            adjusted: "true",
            sort: "asc",
            limit: 5000,
            apiKey: API_KEY,
          },
        }
      );

      const results = response.data.results;

      if (!results || results.length === 0) return;

      const firstValue = results[0].c;
      const lineData: LineData[] = results.map((item: any) => ({
        time: item.t / 1000,
        value: ((item.c - firstValue) / firstValue) * 100,
      }));

      lineSeries.setData(lineData);

      // Save the latest data
      const lastItem = results[results.length - 1];
      latestData.current[ticker] = {
        value: ((lastItem.c - firstValue) / firstValue) * 100,
        time: lastItem.t / 1000,
      };
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error);
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: "#0d0d1b" },
          textColor: "#ffffff",
        },
        grid: {
          vertLines: { color: "#2d3748" },
          horzLines: { color: "#2d3748" },
        },
        rightPriceScale: {
          borderColor: "#485c7b",
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
        timeScale: {
          borderColor: "#485c7b",
        },
        width: chartContainerRef.current.offsetWidth,
        height: chartContainerRef.current.offsetHeight,
      });

      tickers.forEach(({ symbol, color }) => {
        const lineSeries = chart.addLineSeries({
          color,
          lineWidth: 2,
          priceFormat: {
            type: "custom",
            formatter: (price: number) => `${price.toFixed(2)}%`,
          },
        });

        fetchTickerData(symbol, lineSeries);
        seriesRefs.current[symbol] = lineSeries;
      });

      setChartInstance(chart);

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.resize(
            chartContainerRef.current.offsetWidth,
            chartContainerRef.current.offsetHeight
          );
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        chart.remove();
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    if (chartInstance) {
      setTimeout(() => {
        chartInstance.timeScale().fitContent();
      }, 500); // Ensure data is loaded before adjustment
    }
  }, [chartInstance]);

  useEffect(() => {
    if (chartInstance && legendContainerRef.current) {
      const legendElement = legendContainerRef.current;

      const updateLegend = (param: any) => {
        if (param.time) {
          // When hovering
          const time = new Date((param.time as number) * 1000).toLocaleDateString(
            "en-US"
          );

          let legendHTML = `<div style="font-size: 12px; margin-bottom: 8px;">Date: ${time}</div>`;

          tickers.forEach(({ symbol, color, sector }) => {
            const seriesData = param.seriesData.get(seriesRefs.current[symbol]);
            if (seriesData && typeof seriesData.value === "number") {
              legendHTML += `<div style="color: ${color}; font-size: 12px;">
                              ${symbol} (${sector}): ${seriesData.value.toFixed(2)}%
                            </div>`;
            }
          });

          legendElement.innerHTML = legendHTML;
        } else {
          // When not hovering, show the latest data
          let latestHTML = `<div style="font-size: 12px; margin-bottom: 8px;">Latest Data</div>`;
          Object.entries(latestData.current).forEach(([symbol, { value, time }]) => {
            const date = new Date(time * 1000).toLocaleDateString("en-US");
            const sector = tickers.find((t) => t.symbol === symbol)?.sector || "";
            const color = tickers.find((t) => t.symbol === symbol)?.color || "white";

            latestHTML += `<div style="color: ${color}; font-size: 12px;">
                            ${symbol} (${sector}): ${value.toFixed(2)}% 
                          </div>`;
          });
          legendElement.innerHTML = latestHTML;
        }
      };

      chartInstance.subscribeCrosshairMove(updateLegend);

      return () => {
        chartInstance.unsubscribeCrosshairMove(updateLegend);
      };
    }
  }, [chartInstance]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        ref={chartContainerRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></div>
      <div
        ref={legendContainerRef}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          color: "white",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "8px",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );
};

export default FiscalOverviewChart;
