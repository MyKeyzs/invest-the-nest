import React, { useState, useEffect, useRef } from 'react';
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
  const chartRef = useRef<any>(null);
  const [crosshair, setCrosshair] = useState({ x: 0, y: 0, show: false });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { timespan, multiplier, fromDate } = getTimeframeSettings(timeframe);
        const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${fromDate}/${getEndDate()}`, {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        // Log the response data to ensure it is what you expect
        console.log("API Response:", response.data);

        // Defensive check to ensure response.data.results is defined and an array
        if (response.data && Array.isArray(response.data.results)) {
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
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Unexpected data format. Please try again later.');
        }
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

  const handleMouseMove = (event: React.MouseEvent) => {
    const chart = chartRef.current;
    if (chart && chart.chartArea) {
      const chartArea = chart.chartArea;
      const rect = chart.canvas.getBoundingClientRect();

      // Calculate the mouse position relative to the chart area
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Constrain the crosshair within the chart area
      if (
        x >= chartArea.left &&
        x <= chartArea.right &&
        y >= chartArea.top &&
        y <= chartArea.bottom
      ) {
        setCrosshair({ x, y, show: true });
      } else {
        setCrosshair({ ...crosshair, show: false });
      }
    }
  };

  const handleMouseLeave = () => {
    setCrosshair({ ...crosshair, show: false });
  };

  return (
    <div
      className="bg-gray-900 text-white p-4 rounded-md chart-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
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
      <div className="graph-area">
        {error ? (
          <p>{error}</p>
        ) : chartData ? (
          <>
            <Line
              ref={chartRef}
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
            {/* Conditionally render the crosshair within the chart boundaries */}
            {crosshair.show && (
              <>
                <div
                  className="chartjs-crosshair horizontal"
                  style={{
                    top: `${crosshair.y}px`,
                    width: `${chartRef.current.chartArea.width}px`,
                    left: `${chartRef.current.chartArea.left}px`,
                  }}
                />
                <div
                  className="chartjs-crosshair vertical"
                  style={{
                    left: `${crosshair.x}px`,
                    height: `${chartRef.current.chartArea.height}px`,
                    top: `${chartRef.current.chartArea.top}px`,
                  }}
                />
              </>
            )}
          </>
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default Chart;
