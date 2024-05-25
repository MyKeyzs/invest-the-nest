import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TickerData {
  ticker: string;
  close: number;
  percent_change: number;
}

const TopTickers: React.FC = () => {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers', {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        // Check if response data and tickers are available
        if (response.data && response.data.tickers) {
          const data = response.data.tickers.slice(0, 6).map((ticker: any) => ({
            ticker: ticker.ticker,
            // Use optional chaining to safely access nested properties and provide a default value
            close: ticker.lastTrade?.p ?? 0,
            // Provide a default value for percent_change
            percent_change: ticker.todaysChangePerc ?? 0,
          }));

          setTickers(data);
          setError(null); // Clear any previous errors
        } else {
          // Set an error message if the expected structure is not present
          setError('Unexpected API response structure');
        }
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        setError('Error fetching ticker data. Please try again later.');
      }
    };

    fetchTickers();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="flex justify-between">
          {tickers.map((ticker) => (
            <div key={ticker.ticker} className="flex items-center space-x-2">
              <span>{ticker.ticker}</span>
              <span className={ticker.percent_change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {ticker.percent_change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopTickers;
