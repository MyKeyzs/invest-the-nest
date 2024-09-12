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
    const fetchTickers = async () => {
      try {
        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?include_otc=false', {
          params: {
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX',
          },
        });
  
        const data = response.data.tickers
          .filter((ticker: any) => ticker.day.v > 200000)
          .sort((a: any, b: any) => b.todaysChangePerc - a.todaysChangePerc)
          .slice(0, 20)
          .map((ticker: any) => ({
            ticker: ticker.ticker,
            percent_change: ticker.todaysChangePerc ?? 0,
          }));
  
        console.log(data); // Log the tickers to verify if data is being fetched
        setTickers(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        setError('Error fetching ticker data. Please try again later.');
      }
    };
  
    fetchTickers();
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
