import React, { useState, useEffect } from "react";
import "./crypto.css"; // Include corresponding styling
import cryptoData from "./crypto.json"; // Import JSON data

interface Crypto {
  name: string;
  price: number;
  unit: string;
  icon: string;
}

const Crypto: React.FC = () => {
  const [data, setData] = useState<Crypto[]>([]);

  useEffect(() => {
    // Load the data from the JSON file
    setData(cryptoData);
  }, []);

  return (
    <div className="crypto-container">
      <h2 className="crypto-title">Cryptocurrency Prices</h2>
      <div className="crypto-table-wrapper">
        <table className="crypto-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Cryptocurrency</th>
              <th>Price</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((crypto, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={crypto.icon}
                    alt={`${crypto.name} Icon`}
                    className="crypto-icon"
                  />
                </td>
                <td>{crypto.name}</td>
                <td>
                  {crypto.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: crypto.price < 1 ? 6 : 2,
                  })}
                </td>
                <td>{crypto.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Crypto;
