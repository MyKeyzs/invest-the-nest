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
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null); // To track the hovered bar

  useEffect(() => {
    const fetchBars = async () => {
      try {
        let date = new Date();
        const dayOfWeek = date.getDay(); // Get current day of the week (0 for Sunday, 6 for Saturday)
  
        // If it's Saturday or Sunday, use Friday's date instead
        if (dayOfWeek === 6) { // If it's Saturday
          date.setDate(date.getDate() - 1); // Move back to Friday
        } else if (dayOfWeek === 0) { // If it's Sunday
          date.setDate(date.getDate() - 2); // Move back to Friday
        }
  
        const formattedDate = date.toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
  
        const response = await axios.get(`https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${formattedDate}`, {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });
  
        // Check if response.data.results exists and is an array
        if (response.data && Array.isArray(response.data.results)) {
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
        } else {
          // Handle cases where results is undefined or not an array
          setError('No data available for the selected date.');
        }
      } catch (error) {
        console.error('Error fetching grouped bars data:', error);
        setError('Error fetching grouped bars data. Please try again later.');
      }
    };
  
    fetchBars();
  }, []);

  // Build the chart data, changing the color dynamically
  const chartData = {
    labels: bars.map((bar) => bar.ticker),
    datasets: [
      {
        label: 'Volume',
        data: bars.map((bar) => bar.volume),
        backgroundColor: bars.map((_, index) =>
          index === hoveredBarIndex ? 'rgba(0, 255, 0, 0.6)' : 'rgba(75, 192, 192, 0.6)'
        ), // Green for hovered bar
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options
  const options = {
    onHover: (event: any, elements: any) => {
      if (elements.length > 0) {
        setHoveredBarIndex(elements[0].index); // Set hovered bar index
      } else {
        setHoveredBarIndex(null); // Reset when not hovering
      }
    },
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