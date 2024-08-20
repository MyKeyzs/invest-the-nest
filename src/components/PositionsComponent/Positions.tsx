import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Positions.css';

interface PositionData {
  symbol: string;
  shares: number;
  price?: number;
  total?: number;
}

interface PositionsProps {
  onSelectTicker: (symbol: string) => void; // Correctly type the onSelectTicker prop
}

const Positions: React.FC<PositionsProps> = ({ onSelectTicker }) => {
  const [positions, setPositions] = useState<PositionData[]>(() => {
    const savedPositions = localStorage.getItem('positions');
    return savedPositions
      ? JSON.parse(savedPositions)
      : [
          { symbol: 'AAPL', shares: 10 },
          { symbol: 'GOOGL', shares: 5 },
          { symbol: 'MSFT', shares: 20 },
          { symbol: 'AMZN', shares: 2 },
          { symbol: 'TSLA', shares: 7 },
        ];
  });

  const [error, setError] = useState<string | null>(null);
  const [newTicker, setNewTicker] = useState<string>(''); // State to handle new ticker input

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const symbols = positions.map((position) => position.symbol).join(',');

        const response = await axios.get('https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers', {
          params: {
            tickers: symbols,
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your actual API key
          },
        });

        if (response.data && response.data.tickers) {
          const data = response.data.tickers.reduce((acc: Record<string, number>, ticker: any) => {
            if (ticker && ticker.ticker && ticker.day && ticker.day.c) {
              acc[ticker.ticker] = ticker.day.c;
            }
            return acc;
          }, {});

          setPositions((prevPositions) =>
            prevPositions.map((position) => ({
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
        console.error('Error fetching stock prices:', error);
        setError('Error fetching stock prices. Please try again later.');
      }
    };

    fetchPrices(); // Fetch initial prices

    const interval = setInterval(fetchPrices, 60000); // Poll every 60 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []); // Empty dependency array means this useEffect runs only once on mount

  // Save positions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('positions', JSON.stringify(positions));
  }, [positions]);

  const handleSharesChange = (symbol: string, shares: number) => {
    setPositions((prevPositions) =>
      prevPositions.map((position) =>
        position.symbol === symbol
          ? { ...position, shares, total: (position.price || 0) * shares }
          : position
      )
    );
  };

  const handleAddTicker = () => {
    if (newTicker && !positions.some((position) => position.symbol === newTicker.toUpperCase())) {
      setPositions([...positions, { symbol: newTicker.toUpperCase(), shares: 0 }]);
      setNewTicker(''); // Clear the input after adding
    }
  };

  const handleDeleteTicker = (symbol: string) => {
    setPositions((prevPositions) => prevPositions.filter((position) => position.symbol !== symbol));
  };

  const calculateTotalValue = () => {
    return positions.reduce((sum, position) => sum + (position.total || 0), 0).toFixed(2);
  };

  const handleClickTicker = (symbol: string) => {
    console.log(`Ticker clicked: ${symbol}`); // Log when a ticker is clicked
    onSelectTicker(symbol);
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
                <span className="item-remove" onClick={() => handleDeleteTicker(position.symbol)}>
                  x
                </span>
                <span
                  className="item-symbol"
                  onClick={() => handleClickTicker(position.symbol)} // Handle the click event
                  style={{ cursor: 'pointer', color: 'lightblue' }} // Styling for clickable items
                >
                  {position.symbol}
                </span>
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
          <div className="total-value">
            <span>Total Value: </span>
            <span className="total-value-amount">{calculateTotalValue()}</span>
          </div>
          <div className="add-ticker">
            <input
              type="text"
              value={newTicker}
              onChange={(e) => setNewTicker(e.target.value)}
              placeholder="Enter ticker symbol"
              className="ticker-input"
            />
            <button onClick={handleAddTicker} className="add-ticker-button">
              + Add Ticker
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;
