import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart, CrosshairMode, IChartApi, ISeriesApi } from 'lightweight-charts';
import './Chart.css';

interface ChartProps {
  ticker: string;
}

const Chart: React.FC<ChartProps> = ({ ticker }) => {
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Candlestick' | 'Line'> | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate the start date based on the timeframe
  const calculateStartDate = (): string => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 for Sunday, 6 for Saturday

    // Adjust for weekends: Use Friday's date if today is Saturday or Sunday
    if (dayOfWeek === 6) {
      today.setDate(today.getDate() - 1); // Saturday -> Friday
    } else if (dayOfWeek === 0) {
      today.setDate(today.getDate() - 2); // Sunday -> Friday
    }

    switch (timeframe) {
      case '1D':
        today.setDate(today.getDate() - 1);
        break;
      case '1W':
        today.setDate(today.getDate() - 7);
        break;
      case '1M':
        today.setMonth(today.getMonth() - 1);
        break;
      case '3M':
        today.setMonth(today.getMonth() - 3);
        break;
      case '6M':
        today.setMonth(today.getMonth() - 6);
        break;
      case '1Y':
        today.setFullYear(today.getFullYear() - 1);
        break;
      case 'YTD':
        today.setMonth(0, 1); // January 1st of the current year
        break;
      default:
        today.setMonth(today.getMonth() - 1); // Default to 1M
    }

    return today.toISOString().split('T')[0];
  };

  // Determine API endpoint based on timeframe
  const determineApiUrl = (startDate: string, endDate: string): string => {
    const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX';
    if (timeframe === '1D') {
      return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/5/minute/${startDate}/${endDate}?apiKey=${apiKey}`;
    } else if (timeframe === '1W') {
      return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/30/minute/${startDate}/${endDate}?apiKey=${apiKey}`;
    } else if (timeframe === '1M') {
      return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/4/hour/${startDate}/${endDate}?apiKey=${apiKey}`;
    } else {
      return `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate}/${endDate}?apiKey=${apiKey}`;
    }
  };

  // Fetch data from Polygon API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDate = calculateStartDate();
        const apiUrl = determineApiUrl(startDate, endDate);

        const response = await axios.get(apiUrl);
        const result = response.data.results;

        if (chartType === 'candlestick') {
          setData(
            result.map((item: any) => ({
              time: item.t / 1000,
              open: item.o,
              high: item.h,
              low: item.l,
              close: item.c,
            }))
          );
        } else {
          setData(
            result.map((item: any) => ({
              time: item.t / 1000,
              value: item.c,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching data from Polygon API', error);
        setError('Error fetching chart data. Please try again later.');
      }
    };

    fetchChartData();
  }, [ticker, chartType, timeframe]);

  // Initialize chart and manage series
  useEffect(() => {
    if (!chartContainerRef.current) return;

    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#0d0d1b' },
          textColor: '#C3BCDB',
          fontFamily: "'Roboto', sans-serif",
        },
        grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
          vertLine: {
            color: '#C3BCDB44',
            labelBackgroundColor: '#9B7DFF',
          },
          horzLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
          },
        },
        timeScale: {
          borderColor: '#71649C',
        },
        rightPriceScale: {
          borderColor: '#71649C',
          scaleMargins: {
            top: 0.1,
            bottom: 0.2,
          },
        },
      });
    }

    if (seriesRef.current) {
      chartRef.current?.removeSeries(seriesRef.current);
    }

    if (chartType === 'candlestick') {
      seriesRef.current = chartRef.current.addCandlestickSeries();
    } else {
      seriesRef.current = chartRef.current.addLineSeries();
    }

    if (seriesRef.current) {
      seriesRef.current.setData(data);
    }

   // Fit the content to the full width of the container
   chartRef.current.timeScale().fitContent();
  }, [chartType, data]);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(
          chartContainerRef.current.clientWidth,
          chartContainerRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        <div className="chart-type-container">
        <span className="ticker-title">{`${ticker}`}</span>
        <button
            className={`chart-type-button ${chartType === 'line' ? 'active' : ''}`}
            onClick={() => setChartType('line')}
          >
            L
          </button>
          <button
            className={`chart-type-button ${chartType === 'candlestick' ? 'active' : ''}`}
            onClick={() => setChartType('candlestick')}
          >
            C
          </button>
        </div>
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





