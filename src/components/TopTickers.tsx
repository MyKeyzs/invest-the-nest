import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopTickers.css';

interface TickerData {
  ticker: string;
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
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX',
          },
        });

        const data = response.data.tickers
          .sort((a: any, b: any) => b.todaysChangePerc - a.todaysChangePerc)
          .slice(0, 20)
          .map((ticker: any) => ({
            ticker: ticker.ticker,
            percent_change: ticker.todaysChangePerc ?? 0,
          }));

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
    <div className="ticker-section">
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="ticker-wrapper">
          {tickers.map((ticker) => (
            <div key={ticker.ticker} className="ticker-item">
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
