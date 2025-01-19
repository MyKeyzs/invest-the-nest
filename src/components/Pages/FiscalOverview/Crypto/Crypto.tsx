import React, { useState, useEffect } from "react";
import axios from "axios";
import "./crypto.css"; // Include corresponding styling

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
}

const Crypto: React.FC = () => {
  const [data, setData] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
            },
          }
        );

        setData(response.data);
      } catch (err) {
        setError("Failed to fetch cryptocurrency data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="crypto-container">
      <h2 className="crypto-title">Cryptocurrency Prices</h2>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <div className="crypto-table-wrapper">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>Icon</th>
                <th>Cryptocurrency</th>
                <th>Price</th>
                <th>Symbol</th>
              </tr>
            </thead>
            <tbody>
              {data.map((crypto) => (
                <tr key={crypto.id}>
                  <td>
                    <img
                      src={crypto.image}
                      alt={`${crypto.name} Icon`}
                      className="crypto-icon"
                    />
                  </td>
                  <td>{crypto.name}</td>
                  <td>
                    {crypto.current_price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits:
                        crypto.current_price < 1 ? 6 : 2,
                    })}
                  </td>
                  <td>{crypto.symbol.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Crypto;
