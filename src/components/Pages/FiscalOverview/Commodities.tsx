import React, { useState, useEffect } from "react";
import "./commodities.css"; // Include corresponding styling
import commoditiesData from "./commodities.json"; // Import JSON data

interface Commodity {
  name: string;
  price: number;
  unit: string;
  icon: string;
}

const Commodities: React.FC = () => {
  const [data, setData] = useState<Commodity[]>([]);

  useEffect(() => {
    // Load the data from the JSON file
    setData(commoditiesData);
  }, []);

  return (
    <div className="commodities-container">
      <h2 className="commodities-title">Commodities Prices</h2>
      <div className="commodities-table-wrapper">
        <table className="commodities-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Commodity</th>
              <th>Price</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((commodity, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={commodity.icon}
                    alt={`${commodity.name} Icon`}
                    className="commodity-icon"
                  />
                </td>
                <td>{commodity.name}</td>
                <td>
                  {commodity.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td>{commodity.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Commodities;
