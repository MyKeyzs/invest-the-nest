import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopTickers.css';

// Interface for Ticker Data
interface TickerData {
  ticker: string;
  percent_change: number;
}

const TopTickers: React.FC = () => {
  // State to store tickers data
  const [tickers, setTickers] = useState<TickerData[]>([]);
  // State to store any error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch tickers data from the API
    const fetchTickers = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?include_otc=false', {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX',
          },
        });

        // Process and sort the data by today's percentage change, filter by volume
        const data = response.data.tickers
          .filter((ticker: any) => ticker.day.v > 200000) // Filter tickers by volume
          .sort((a: any, b: any) => b.todaysChangePerc - a.todaysChangePerc)
          .slice(0, 20) // Take the top 20 tickers
          .map((ticker: any) => ({
            ticker: ticker.ticker,
            percent_change: ticker.todaysChangePerc ?? 0,
          }));

        setTickers(data); // Update the state with the fetched data
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        setError('Error fetching ticker data. Please try again later.');
      }
    };

    fetchTickers(); // Call the function to fetch tickers data on component mount
  }, []);

  return (
    <div className="ticker-container">
      <div className="ticker-title">Today's Top Gainers</div>
      <div className="ticker-section">
        {error ? (
          // Display error message if there is an error
          <p>{error}</p>
        ) : (
          // Display the tickers in a scrolling wrapper if no error
          <div className="ticker-wrapper">
            {[...tickers, ...tickers].map((ticker, index) => (
              <div key={index} className="ticker-item">
                <span>{ticker.ticker}</span>
                <span className={ticker.percent_change >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {ticker.percent_change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTickers;
