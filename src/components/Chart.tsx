import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chart.css'; // Import the CSS file for animations
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

const Chart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/${getStartDate(timeframe)}/${getEndDate()}`, {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        const data = response.data.results.map((result: any) => ({
          x: new Date(result.t),
          y: result.c,
        }));

        setChartData({
          datasets: [
            {
              label: `AAPL ${timeframe} Data`,
              data,
              fill: false,
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
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
  }, [timeframe]);

  const getStartDate = (timeframe: string) => {
    const now = new Date();
    switch (timeframe) {
      case '1D':
        return new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
      case '1W':
        return new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
      case '1M':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString().split('T')[0];
      case '6M':
        return new Date(now.setMonth(now.getMonth() - 6)).toISOString().split('T')[0];
      case '1Y':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString().split('T')[0];
      default:
        return new Date(now.setDate(now.getDate() - 1)).toISOString().split('T')[0];
    }
  };

  const getEndDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      <div className="flex justify-between mb-4">
        {['1D', '1W', '1M', '6M', '1Y'].map((tf) => (
          <button
            key={tf}
            className={`px-4 py-2 rounded ${timeframe === tf ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-600`}
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
