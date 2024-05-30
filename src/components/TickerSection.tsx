import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TickerSection.css'; // Import the CSS file for animations

interface TickerData {
  ticker: string;
  percent_change: number;
}

const TickerSection: React.FC = () => {
  const [tickers, setTickers] = useState<TickerData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickers = async () => {
      const tickerSymbols = ['SPY', 'QQQ', 'DXY', 'IWM'];
      try {
        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers', {
          params: {
            tickers: tickerSymbols.join(','),
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your Polygon API key
          },
        });

        if (response.data && response.data.tickers) {
          const data = response.data.tickers.map((ticker: any) => ({
            ticker: ticker.ticker,
            percent_change: ticker.todaysChangePerc ?? 0,
          })).sort((a: TickerData, b: TickerData) => b.percent_change - a.percent_change).slice(0, 20);

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
    <div className="ticker-container">
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="ticker-wrapper">
          <div className="ticker-content">
            {tickers.map((ticker) => (
              <div key={ticker.ticker} className="ticker-item">
                <span>{ticker.ticker}</span>
                <span className={ticker.percent_change >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {ticker.percent_change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
          <div className="ticker-content">
            {tickers.map((ticker) => (
              <div key={ticker.ticker} className="ticker-item">
                <span>{ticker.ticker}</span>
                <span className={ticker.percent_change >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {ticker.percent_change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TickerSection;
