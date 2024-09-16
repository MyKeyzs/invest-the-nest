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
  const [ohlcData, setOhlcData] = useState<any>(null); // State to hold OHLC data
  const [currentOHLC, setCurrentOHLC] = useState<any>(null); // State to hold the current OHLC data
  const [showOHLC, setShowOHLC] = useState(true); // State to toggle OHLC visibility
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

        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.results)) {
          const data = response.data.results.map((result: any, index: number, array: any[]) => {
            const prevClose = index > 0 ? array[index - 1].c : result.c;
            return {
              x: new Date(result.t),
              y: result.c,
              open: result.o,  // Store the open value
              high: result.h,  // Store the high value
              low: result.l,   // Store the low value
              close: result.c, // Store the close value
              volume: result.v, // Store the volume value
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

          setOhlcData(data); // Store the OHLC data for the tooltip
          setCurrentOHLC(data[data.length - 1]); // Initialize with the most recent data point
          setError(null); 
        } else {
          console.error('Unexpected API response structure:', response.data);
          setError('Unexpected data format. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
        setError('Error fetching chart data. Please try again later.');
      }
    };

    fetchChartData(); // Fetch chart data whenever ticker or timeframe changes
  }, [ticker, timeframe]);

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
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

  if (dayOfWeek === 6) {
    // If it's Saturday, subtract one day to get Friday
    today.setDate(today.getDate() - 1);
  } else if (dayOfWeek === 0) {
    // If it's Sunday, subtract two days to get Friday
    today.setDate(today.getDate() - 2);
  }

  return today.toISOString().split('T')[0]; // Return the date in the format YYYY-MM-DD
};

  const handleMouseMove = (event: React.MouseEvent) => {
    const chart = chartRef.current;
    if (chart && chart.chartArea) {
      const chartArea = chart.chartArea;
      const rect = chart.canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (
        x >= chartArea.left &&
        x <= chartArea.right &&
        y >= chartArea.top &&
        y <= chartArea.bottom
      ) {
        setCrosshair({ x, y, show: true });
        updateCurrentOHLC(x); // Update OHLC based on crosshair position
      } else {
        setCrosshair({ ...crosshair, show: false });
        setCurrentOHLC(ohlcData[ohlcData.length - 1]); // Reset to the latest data when outside the chart
      }
    }
  };

  const handleMouseLeave = () => {
    setCrosshair({ ...crosshair, show: false });
    setCurrentOHLC(ohlcData[ohlcData.length - 1]); // Reset to the latest data when outside the chart
  };

  const updateCurrentOHLC = (x: number) => {
    if (!chartRef.current || !ohlcData) return;
    const xScale = chartRef.current.scales.x;
    const index = xScale.getValueForPixel(x);
    
    // Find the closest data point
    const closestIndex = ohlcData.findIndex((d: any) => d.x.getTime() === index);

    if (closestIndex !== -1) {
      setCurrentOHLC(ohlcData[closestIndex]);
    } else {
      const closestDataPoint = ohlcData.reduce((prev: any, curr: any) => {
        return Math.abs(curr.x.getTime() - index) <
          Math.abs(prev.x.getTime() - index)
          ? curr
          : prev;
      });

      setCurrentOHLC(closestDataPoint);
    }
  };

  return (
    <div
      className="text-white p-4 rounded-md chart-container relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`chart-title`}>
        <span className="chart-text">{`${ticker} Chart`}</span>
        <button
          onClick={() => setShowOHLC(!showOHLC)}
          style={{
            marginLeft: '20px',
            padding: '2px 5px',
            backgroundColor: showOHLC ? '#1f2937' : '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            fontSize: '10px',
          }}
        >
          {showOHLC ? 'Hide OHLC' : 'Show OHLC'}
        </button>
      </div>
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
                      color: '#ffffff',
                      font: {
                        size: 16,
                        weight: 'bold',
                      },
                    },
                    ticks: {
                      color: '#ffffff',
                      font: {
                        size: 14,
                        weight: 'bold',
                      },
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.2)',
                    },
                    border: {
                      color: '#ffffff',
                      width: 2,
                    },
                  },
                  y: {
                    position: 'right',
                    title: {
                      display: true,
                      text: 'Price',
                      color: '#ffffff',
                      font: {
                        size: 16,
                        weight: 'bold',
                      },
                    },
                    ticks: {
                      color: '#ffffff',
                      font: {
                        size: 14,
                        weight: 'bold',
                      },
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.2)',
                    },
                    border: {
                      color: '#ffffff',
                      width: 2,
                    },
                  },
                },
              }}
            />
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
            {showOHLC && currentOHLC && (
              <div
                className="ohlc-tooltip"
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  color: "white",
                  padding: "5px",
                  borderRadius: "3px",
                  fontSize: "12px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                <div>O: {currentOHLC.open}</div>
                <div>H: {currentOHLC.high}</div>
                <div>L: {currentOHLC.low}</div>
                <div>C: {currentOHLC.close}</div>
                <div>V: {currentOHLC.volume}</div>
              </div>
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
