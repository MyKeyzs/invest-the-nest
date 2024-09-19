import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

interface TvChartProps {
  ticker: string;
  interval: string;  // '1', '5', '15', 'D', etc.
  chartType: 'candlestick' | 'line';  // Allow switching between line and candlestick
}

const TvChart: React.FC<TvChartProps> = ({ ticker, interval, chartType }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null); // To store the chart instance
  const [data, setData] = useState<any[]>([]);

  // Fetch stock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0]; // Current date
        const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX';
        const baseURL = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-01/${today}?apiKey=${apiKey}`;

        const response = await axios.get(baseURL);
        const result = response.data.results;
        
        // Format data based on chart type
        if (chartType === 'candlestick') {
          setData(result.map((item: any) => ({
            time: item.t / 1000,  // Convert timestamp to seconds
            open: item.o,
            high: item.h,
            low: item.l,
            close: item.c,
          })));
        } else {
          setData(result.map((item: any) => ({
            time: item.t / 1000,  // Convert timestamp to seconds
            value: item.c,        // Line chart uses closing price
          })));
        }
      } catch (error) {
        console.error('Error fetching data from Polygon API', error);
      }
    };

    fetchData();
  }, [ticker, chartType]);

  // Initialize chart and update with data
  useEffect(() => {
    // If chart container exists and chart is not yet initialized
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
            background: { color: "#222" },
            textColor: "#C3BCDB",
            fontFamily: "'Roboto', sans-serif",
          },
          grid: {
            vertLines: { color: "#444" },
            horzLines: { color: "#444" },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
              color: "#C3BCDB44",
              labelBackgroundColor: "#9B7DFF",
            },
            horzLine: {
              color: "#9B7DFF",
              labelBackgroundColor: "#9B7DFF",
            },
          },
          timeScale: {
            borderColor: "#71649C",
          },
          rightPriceScale: {
            borderColor: "#71649C",
            
            scaleMargins: {
              top: 0.1,   // Adjust the top margin
              bottom: 0.2 // Adjust the bottom margin
              
            },
          }
        });

      if (chartType === 'candlestick') {
        chartRef.current.series = chartRef.current.addCandlestickSeries();
      } else {
        chartRef.current.series = chartRef.current.addLineSeries();
      }
    }

    // Set chart data
    if (chartRef.current && chartRef.current.series) {
      chartRef.current.series.setData(data);
    }

    // Cleanup: Destroy the chart on unmount or update
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, chartType]);

  return (
    <div>
      <h4>TradingView Chart - {ticker}</h4>
      <div ref={chartContainerRef} style={{ width: '500px', height: '400px', paddingRight: '50px'}} />
    </div>
  );
};

export default TvChart;
