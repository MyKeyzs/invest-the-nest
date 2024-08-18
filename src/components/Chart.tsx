import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chart.css';
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  ticker: string;
}

const Chart: React.FC<ChartProps> = ({ ticker }) => {
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { timespan, multiplier, fromDate } = getTimeframeSettings(timeframe);
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromDate}/${getEndDate()}`, {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        const data = response.data.results.map((result: any, index: number, array: any[]) => {
          if (index === 0) {
            return {
              x: new Date(result.t),
              y: result.c,
              color: 'rgba(0, 255, 0, 1)', // Default to green for the first data point
            };
          }
          const prevClose = array[index - 1].c;
          return {
            x: new Date(result.t),
            y: result.c,
            color: result.c >= prevClose ? 'rgba(0, 255, 0, 1)' : 'rgba(255, 0, 0, 1)',
          };
        });

        setChartData({
          datasets: [
            {
              label: `${ticker} ${timeframe} Data`,
              data: data.map((point: any) => ({ x: point.x, y: point.y })),
              fill: false,
              segment: {
                borderColor: (context: any) => {
                  const index = context.p1DataIndex;
                  return data[index].color;
                },
              },
              borderWidth: 2,
            },
          ],
        });
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Error fetching chart data. Please try again later.');
      }
    };

    fetchChartData();
  }, [ticker, timeframe]); // Re-fetch data when the ticker or timeframe changes

  const getTimeframeSettings = (timeframe: string) => {
    const now = new Date();
    let timespan = 'day';
    let multiplier = 1;
    let fromDate = '';

    switch (timeframe) {
      case '1D':
        timespan = 'minute';
        fromDate = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
        break;
      case '1W':
        timespan = 'hour';
        fromDate = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
        break;
      case '1M':
        timespan = 'day';
        fromDate = new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
        break;
      case '3M':
        timespan = 'day';
        fromDate = new Date(now.setMonth(now.getMonth() - 3)).toISOString().split('T')[0];
        break;
      case '6M':
        timespan = 'day';
        fromDate = new Date(now.setMonth(now.getMonth() - 6)).toISOString().split('T')[0];
        break;
      case '1Y':
        timespan = 'week';
        fromDate = new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
        break;
      case '5Y':
        timespan = 'month';
        fromDate = new Date(now.setFullYear(now.getFullYear() - 5)).toISOString().split('T')[0];
        break;
      case '10Y':
        timespan = 'quarter';
        fromDate = new Date(now.setFullYear(now.getFullYear() - 10)).toISOString().split('T')[0];
        break;
      case 'YTD':
        timespan = 'day';
        fromDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      default:
        fromDate = new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
        break;
    }

    return { timespan, multiplier, fromDate };
  };

  const getEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
  <div className="chart-title">{ticker} Chart</div> {/* Centered Title */}
  <div className="timeframes-container">
    {['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', '10Y', 'YTD'].map((tf) => (
      <button
        key={tf}
        className={`timeframe-button ${timeframe === tf ? 'active' : ''}`}
        onClick={() => setTimeframe(tf)}
      >
        {tf}
      </button>
    ))}
  </div>
  {error ? (
    <p>{error}</p>
  ) : chartData ? (
    <Line
      data={chartData}
      options={{
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            position: 'right',
            title: {
              display: true,
              text: 'Price',
            },
          },
        },
      }}
    />
  ) : (
    <p>Loading chart data...</p>
  )}
</div>
  );
};

export default Chart;
