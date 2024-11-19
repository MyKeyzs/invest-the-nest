import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig'; // Adjust the path as necessary
import './Positions.css';

interface PositionData {
  symbol: string;
  shares: number;
  price?: number;
  total?: number;
}

// Define the TickerResult type for type safety
interface TickerResult {
  symbol: string;
  price: number;
  total: number;
}

interface PositionsProps {
  onSelectTicker: (symbol: string) => void;
}

const Positions: React.FC<PositionsProps> = ({ onSelectTicker }) => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newTicker, setNewTicker] = useState<string>('');

  // Fetch user's positions from Firestore on component mount
  useEffect(() => {
    const fetchUserPositions = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'Users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData?.stocksOwned) {
              setPositions(userData.stocksOwned);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user positions:', error);
        setError('Error fetching user data. Please try again later.');
      }
    };

    fetchUserPositions();
  }, []);

  // Fetch the latest prices for the stocks owned
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        console.log('Positions array:', positions);
    
        const symbols = positions.map((position) => position.symbol).join(',');
        console.log('Fetching prices for symbols:', symbols);
    
        if (!symbols) {
          console.log('No symbols found, exiting fetchPrices.');
          return;
        }
    
        const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers`, {
          params: {
            tickers: symbols,
            apiKey: 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX', // Replace with your actual API key
          },
        });
    
        console.log('API Response:', response.data);
    
        if (response.data && response.data.tickers) {
          const results: TickerResult[] = response.data.tickers.map((tickerData: any) => {
            const symbol = tickerData.ticker;
            // Use the closing price from the 'day' object if the market is closed
            const price = tickerData.day && tickerData.day.c ? tickerData.day.c : (tickerData.lastQuote && tickerData.lastQuote.p ? tickerData.lastQuote.p : 0);
            const shares = positions.find((position) => position.symbol === symbol)?.shares || 0;
    
            return {
              symbol,
              price,
              total: price * shares,
            };
          });
    
          console.log('Parsed Results:', results);
    
          setPositions((prevPositions) =>
            prevPositions.map((position) => {
              const result = results.find((r: TickerResult) => r.symbol === position.symbol);
              return result ? { ...position, price: result.price, total: result.total } : position;
            })
          );
    
          console.log('Updated positions:', positions);
        } else {
          console.log('No tickers found in the API response.');
        }
    
        setError(null);
      } catch (error) {
        console.error('Error fetching stock prices:', error);
        setError('Error fetching stock prices. Please try again later.');
      }
    };
    

    if (positions.length > 0) {
      
      const interval = setInterval(fetchPrices, 60000); // Poll every 60 seconds
      fetchPrices(); // Fetch initial prices
      return () => clearInterval(interval); // Cleanup on component unmount
    }
  }, [positions]); // Dependency on `positions` to refetch when the array changes

  // Save positions to Firestore when the "Save" button is clicked
  const handleSavePositions = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'Users', user.uid);
        await updateDoc(userDocRef, { stocksOwned: positions });
        console.log('Positions saved successfully!');
        alert('Portfolio updated successfully!');
      } else {
        console.log('No user is logged in.');
      }
    } catch (error) {
      console.error('Error saving positions to Firestore:', error);
      setError('Error saving positions. Please try again later.');
    }
  };

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
      setNewTicker('');
    }
  };

  const handleDeleteTicker = (symbol: string) => {
    setPositions((prevPositions) => prevPositions.filter((position) => position.symbol !== symbol));
  };

  const calculateTotalValue = () => {
    return positions.reduce((sum, position) => sum + (position.total || 0), 0).toFixed(2);
  };

  const handleClickTicker = (symbol: string) => {
    console.log(`Ticker clicked: ${symbol}`);
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
                  onClick={() => handleClickTicker(position.symbol)}
                  style={{ cursor: 'pointer', color: 'lightblue' }}
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
          <button onClick={handleSavePositions} className="save-button">
            Save Portfolio
          </button>
        </div>
      )}
    </div>
  );
};

export default Positions;
