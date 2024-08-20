import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GainersAndLosers.css'; // Ensure you have this CSS file for styling

interface StockData {
  ticker: string;
  todaysChange: number;
  todaysChangePerc: number;
  day: {
    c: number; // Current Price
  };
}

interface GainersAndLosersProps {
  onSelectTicker: (ticker: string) => void;
}

const GainersAndLosers: React.FC<GainersAndLosersProps> = ({ onSelectTicker }) => {
  const [gainers, setGainers] = useState<StockData[]>([]);
  const [losers, setLosers] = useState<StockData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGainersAndLosers = async () => {
      try {
        const gainersResponse = await axios.get(
          'https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/gainers?apiKey=w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX'
        );
        const losersResponse = await axios.get(
          'https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/losers?apiKey=w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX'
        );

        setGainers(gainersResponse.data.tickers.slice(0, 20));
        setLosers(losersResponse.data.tickers.slice(0, 20));
        setError(null);
      } catch (error) {
        console.error('Error fetching gainers and losers:', error);
        setError('Error fetching gainers and losers data. Please try again later.');
      }
    };

    fetchGainersAndLosers();
  }, []);

  return (
    <div className="gainers-losers-container">
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="gainers-losers-tables">
          <div className="losers">
            <h3>New Lows</h3>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {losers.map((stock) => {
                  const changePercentage = (stock.todaysChange * 100).toFixed(2); // Convert to percentage and format to 2 decimal places
                  return (
                    <tr 
                      key={stock.ticker} 
                      className="loser-row" 
                      onClick={() => onSelectTicker(stock.ticker)} // Send ticker to parent component
                    >
                      <td className="symbol-column">{stock.ticker}</td>
                      <td className="price-column">{stock.day?.c !== undefined ? stock.day.c : 'N/A'}</td> {/* Access nested price in day.c */}
                      <td className="change-column">{stock.todaysChange !== undefined ? `${changePercentage}%` : 'N/A'}</td> {/* Display change as a percentage */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="gainers">
            <h4>New Highs</h4>
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {gainers.map((stock) => {
                  const changePercentage = (stock.todaysChange * 100).toFixed(2); // Convert to percentage and format to 2 decimal places
                  return (
                    <tr 
                      key={stock.ticker} 
                      className="gainer-row" 
                      onClick={() => onSelectTicker(stock.ticker)} // Send ticker to parent component
                    >
                      <td>{stock.ticker}</td>
                      <td>{stock.day?.c !== undefined ? stock.day.c : 'N/A'}</td> {/* Access nested price in day.c */}
                      <td>{stock.todaysChange !== undefined ? `${changePercentage}%` : 'N/A'}</td> {/* Display change as a percentage */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GainersAndLosers;
