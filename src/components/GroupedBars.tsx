import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the necessary components and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GroupedBarData {
  ticker: string;
  volume: number;
  close: number;
  open: number;
  high: number;
  low: number;
}

const GroupedBars: React.FC = () => {
  const [bars, setBars] = useState<GroupedBarData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/2023-05-23', {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        // Sort the data by volume in descending order and take the top 20
        const data = response.data.results
          .map((bar: any) => ({
            ticker: bar.T,
            volume: bar.v,
            close: bar.c,
            open: bar.o,
            high: bar.h,
            low: bar.l,
          }))
          .sort((a: GroupedBarData, b: GroupedBarData) => b.volume - a.volume)
          .slice(0, 20);

        setBars(data);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching grouped bars data:', error);
        setError('Error fetching grouped bars data. Please try again later.');
      }
    };

    fetchBars();
  }, []);

  const chartData = {
    labels: bars.map((bar) => bar.ticker),
    datasets: [
      {
        label: 'Volume',
        data: bars.map((bar) => bar.volume),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      <h2 className="text-xl mb-4">Top 20 Stocks by Volume</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default GroupedBars;
