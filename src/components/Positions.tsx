import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Positions.css'; // Import the CSS file

interface PositionData {
  symbol: string;
  shares: number;
  price?: number;
  total?: number;
}

const Positions: React.FC = () => {
  const [positions, setPositions] = useState<PositionData[]>([
    { symbol: 'AAPL', shares: 10 },
    { symbol: 'GOOGL', shares: 5 },
    { symbol: 'MSFT', shares: 20 },
    { symbol: 'AMZN', shares: 2 },
    { symbol: 'TSLA', shares: 7 },
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = positions.map(position => position.symbol).join(',');

        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers', {
          params: {
            tickers: symbols,
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX',
          },
        });

        if (response.data && response.data.tickers) {
          const data = response.data.tickers.reduce((acc: any, ticker: any) => {
            if (ticker && ticker.ticker && ticker.day && ticker.day.c) {
              acc[ticker.ticker] = ticker.day.c;
            }
            return acc;
          }, {});

          setPositions(prevPositions =>
            prevPositions.map(position => ({
              ...position,
              price: data[position.symbol] || 0,
              total: (data[position.symbol] || 0) * position.shares,
            }))
          );
          setError(null);
        } else {
          setError('Invalid data format received from API.');
        }
      } catch (error) {
        setError('Error fetching stock prices. Please try again later.');
      }
    };

    fetchPrices();
  }, []);

  const handleSharesChange = (symbol: string, shares: number) => {
    setPositions(prevPositions =>
      prevPositions.map(position =>
        position.symbol === symbol
          ? { ...position, shares, total: (position.price || 0) * shares }
          : position
      )
    );
  };

  return (
    <div className="positions-container">
      <h2 className="positions-title">Positions</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div className="positions-header">
            <span className="header-item">Symbol</span>
            <span className="header-item">Shares</span>
            <span className="header-item">Price</span>
            <span className="header-item">Total Value</span>
          </div>
          <ul className="positions-list">
            {positions.map((position) => (
              <li key={position.symbol} className="positions-item">
                <span className="item-symbol">{position.symbol}</span>
                <input
                  type="number"
                  value={position.shares}
                  onChange={(e) => handleSharesChange(position.symbol, parseFloat(e.target.value))}
                  className="item-input"
                />
                <span className="item-price">
                  {position.price ? position.price.toFixed(2) : 'N/A'}
                </span>
                <span className={`item-total ${position.total && position.total < 0 ? 'negative' : 'positive'}`}>
                  {position.total ? position.total.toFixed(2) : 'N/A'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Positions;
