import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        console.log('Fetching prices for symbols:', symbols);

        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers', {
          params: {
            tickers: symbols,
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX',
          },
        });

        console.log('API response:', response.data);

        if (response.data && response.data.tickers) {
          const data = response.data.tickers.reduce((acc: any, ticker: any) => {
            if (ticker && ticker.ticker && ticker.lastTrade) {
              acc[ticker.ticker] = ticker.lastTrade.p;
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
          console.error('Invalid data format received from API:', response.data);
        }
      } catch (error) {
        console.error('Error fetching stock prices:', error);
        setError('Error fetching stock prices. Please try again later.');
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      <h2 className="text-lg font-bold">Positions</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {positions.map((position) => (
            <li key={position.symbol} className="flex justify-between">
              <span className="font-mono">{position.symbol}</span>
              <span className="text-green-500">
                {position.total?.toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Positions;
