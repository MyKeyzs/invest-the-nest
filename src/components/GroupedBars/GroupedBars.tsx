import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GroupedBars.css'; // Import the CSS file for animations
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

interface GroupedBarsProps {
  onBarClick: (ticker: string) => void;
}

const GroupedBars: React.FC<GroupedBarsProps> = ({ onBarClick }) => {
  const [bars, setBars] = useState<GroupedBarData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); // Subtract one day from the current date
        const formattedDate = yesterday.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD

        const response = await axios.get(`https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}`, {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

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
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selectedTicker = bars[index].ticker;
        onBarClick(selectedTicker); // Call the callback function with the selected ticker
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md grouped-bars-container">
      <div className="ticker-title">Top 20 Stocks by Volume</div>
      {error ? (
        <p>{error}</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default GroupedBars;
