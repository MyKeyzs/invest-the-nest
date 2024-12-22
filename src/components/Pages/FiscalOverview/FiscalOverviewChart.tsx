import React, { useEffect, useRef, useState } from "react";
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  HistogramData,
} from "lightweight-charts";
import axios from "axios";

const FiscalOverviewChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const legendContainerRef = useRef<HTMLDivElement | null>(null);

  const [chartInstance, setChartInstance] = useState<IChartApi | null>(null);
  const [spySeries, setSpySeries] = useState<ISeriesApi<"Line"> | null>(null);
  const [qqqSeries, setQqqSeries] = useState<ISeriesApi<"Line"> | null>(null);
  const [diaSeries, setDiaSeries] = useState<ISeriesApi<"Line"> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<"Histogram"> | null>(null);

  const API_KEY = "w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX"; // Replace with your Polygon API Key
  const SPY_TICKER = "SPY";
  const QQQ_TICKER = "QQQ";
  const DIA_TICKER = "DIA";

  const fetchWeeklyData = async (
    ticker: string,
    lineSeries: ISeriesApi<"Line"> | null
  ) => {
    try {
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setDate(today.getDate() - 365);

      const formattedToday = today.toISOString().split("T")[0];
      const formattedoneYearAgo = oneYearAgo.toISOString().split("T")[0];

      const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${formattedoneYearAgo }/${formattedToday}`,
        {
          params: {
            adjusted: "true",
            sort: "asc",
            limit: 5000,
            apiKey: API_KEY,
          },
        }
      );

      const lineData: LineData[] = response.data.results.map((item: any) => ({
        time: item.t / 1000, // Convert timestamp to seconds
        value: item.c, // Closing price
      }));

      if (lineSeries) {
        lineSeries.setData(lineData);
      }
    } catch (error) {
      console.error(`Error fetching weekly data for ${ticker}:`, error);
    }
  };

  useEffect(() => {
    if (spySeries) {
      fetchWeeklyData(SPY_TICKER, spySeries);
    }
    if (qqqSeries) {
      fetchWeeklyData(QQQ_TICKER, qqqSeries);
    }
    if (diaSeries) {
      fetchWeeklyData(DIA_TICKER, diaSeries);
    }
  }, [spySeries, qqqSeries, diaSeries]);

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
        width: chartContainerRef.current.offsetWidth,
        height: chartContainerRef.current.offsetHeight,
      });

      const spy = chart.addLineSeries({
        color: "#4caf50", // Green for SPY
        lineWidth: 2,
      });

      const qqq = chart.addLineSeries({
        color: "#ffd700", // Yellow for QQQ
        lineWidth: 2,
      });

      const dia = chart.addLineSeries({
        color: "#007bff", // Blue for DIA
        lineWidth: 2,
      });

      const volume = chart.addHistogramSeries({
        color: "#26a69a", // Default color for volume bars
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
      });

      volume.priceScale().applyOptions({
        scaleMargins: {
          top: 0.1, // Leave space for the legend
          bottom: 0.05,
        },
      });

      setChartInstance(chart);
      setSpySeries(spy);
      setQqqSeries(qqq);
      setDiaSeries(dia);
      setVolumeSeries(volume);
      chart.timeScale().fitContent();

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

  // Legend setup
  useEffect(() => {
    if (chartInstance && legendContainerRef.current) {
      const legendElement = legendContainerRef.current;

      const updateLegend = (param: any) => {
        const validCrosshairPoint = !(
          param === undefined ||
          param.time === undefined ||
          param.point.x < 0 ||
          param.point.y < 0
        );

        const spyBar = validCrosshairPoint ? param.seriesData.get(spySeries) : null;
        const qqqBar = validCrosshairPoint ? param.seriesData.get(qqqSeries) : null;
        const diaBar = validCrosshairPoint ? param.seriesData.get(diaSeries) : null;

        const time = validCrosshairPoint ? param.time : null;

        const formattedDate = time
          ? new Date(time * 1000).toLocaleDateString("en-US")
          : "No Date";

        const spyPrice = spyBar ? `$${spyBar.value.toFixed(2)}` : "No Price";
        const qqqPrice = qqqBar ? `$${qqqBar.value.toFixed(2)}` : "No Price";
        const diaPrice = diaBar ? `$${diaBar.value.toFixed(2)}` : "No Price";

        legendElement.innerHTML = `
          <div style="font-size: 14px; color: #4caf50;">${SPY_TICKER}: ${spyPrice}</div>
          <div style="font-size: 14px; color: #ffd700;">${QQQ_TICKER}: ${qqqPrice}</div>
          <div style="font-size: 14px; color: #007bff;">${DIA_TICKER}: ${diaPrice}</div>
          <div style="font-size: 12px; margin-top: 4px;">
            ${formattedDate}
          </div>
        `;
      };

      chartInstance.subscribeCrosshairMove(updateLegend);

      return () => {
        chartInstance.unsubscribeCrosshairMove(updateLegend);
      };
    }
  }, [chartInstance, spySeries, qqqSeries, diaSeries]);

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
