import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart, CrosshairMode } from 'lightweight-charts';
import './Chart.css';

interface ChartProps {
  ticker: string;
}

const Chart: React.FC<ChartProps> = ({ ticker }) => {
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('line');
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX';
        const baseURL = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/2023-01-01/${today}?apiKey=${apiKey}`;

        const response = await axios.get(baseURL);
        const result = response.data.results;

        if (chartType === 'candlestick') {
          setData(result.map((item: any) => ({
            time: item.t / 1000,
            open: item.o,
            high: item.h,
            low: item.l,
            close: item.c,
          })));
        } else {
          setData(result.map((item: any) => ({
            time: item.t / 1000,
            value: item.c,
          })));
        }
      } catch (error) {
        console.error('Error fetching data from Polygon API', error);
        setError('Error fetching chart data. Please try again later.');
      }
    };

    fetchChartData();
  }, [ticker, chartType, timeframe]);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: "#0d0d1b" },
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
            top: 0.1,
            bottom: 0.2,
          },
        },
      });

      if (chartType === 'candlestick') {
        chartRef.current.series = chartRef.current.addCandlestickSeries();
      } else {
        chartRef.current.series = chartRef.current.addLineSeries();
      }
    }

    if (chartRef.current && chartRef.current.series) {
      chartRef.current.series.setData(data);
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, chartType]);

  return (
    <div className="chart-container">
      <div className="chart-overlay">
        <div className="timeframes-container">
          {['1D', '1W', '1M', '3M', '6M', '1Y', 'YTD'].map((tf) => (
            <button
              key={tf}
              className={`timeframe-button ${timeframe === tf ? 'active' : ''}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <span className="ticker-title">{`${ticker}`}</span>
      </div>
      {error ? (
        <p>{error}</p>
      ) : (
        <div ref={chartContainerRef} style={{ width: '100%', height: '100%' }} />
      )}
    </div>
  );
};

export default Chart;
