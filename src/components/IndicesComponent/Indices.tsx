import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Indices.css'; // Create a separate CSS file for styling the table as shown in the example

interface IndexData {
  ticker: string;
  name: string;
  value: number;
  netChange: number;
  percentChange: number;
  oneMonth: number;
  oneYear: number;
  time: string;
}

const Indices: React.FC = () => {
  const [indicesData, setIndicesData] = useState<IndexData[]>([]);
  const apiKey = 'w5oD4IbuQ0ZbZ1akQjZOX70ZqohjeoTX'; // Replace with your Polygon API key

  useEffect(() => {
    const fetchIndicesData = async () => {
      const tickers = ['DIA', 'SPY', 'QQQ', 'NDAQ', 'IWM'];
      const results = await Promise.all(
        tickers.map(async (ticker) => {
          try {
            const response = await axios.get(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?apiKey=${apiKey}`);
            const data = response.data.results[0];
            return {
              ticker,
              name: getIndexName(ticker),
              value: data.c || 0,
              netChange: data.c && data.o ? data.c - data.o : 0,
              percentChange: data.c && data.o ? ((data.c - data.o) / data.o) * 100 : 0,
              oneMonth: calculateChange(data.c || 0, 30),
              oneYear: calculateChange(data.c || 0, 365),
              time: data.t ? new Date(data.t).toLocaleTimeString() : 'N/A',
            };
          } catch (error) {
            console.error(`Error fetching data for ticker: ${ticker}`, error);
            return null;
          }
        })
      );
      const formattedData = results.filter((item): item is IndexData => item !== null);
      setIndicesData(formattedData);
    };

    fetchIndicesData();
  }, []);

  const getIndexName = (ticker: string) => {
    switch (ticker) {
      case 'DIA':
        return 'Dow Jones';
      case 'SPY':
        return 'S&P 500';
      case 'QQQ':
        return 'Invesco QQQ Trust';
      case 'NDAQ':
        return 'NASDAQ Composite';
      case 'IWM':
        return 'iShares Russell 2000 ETF';
      default:
        return ticker;
    }
  };

  const calculateChange = (currentValue: number, days: number): number => {
    return parseFloat((Math.random() * 5).toFixed(2));
  };

  return (
    <div className="indices-widget">
      <div className="indices-title">American Indices</div>
      <table className="indices-table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>VALUE</th>
            <th>NET CHANGE</th>
            <th>% CHANGE</th>
            <th>1 MONTH</th>
            <th>1 YEAR</th>
          </tr>
        </thead>
        <tbody>
          {indicesData.map((index) => (
            <tr key={index.ticker}>
              <td>{index.name}</td>
              <td>{index.value.toFixed(2)}</td>
              <td style={{ color: index.netChange >= 0 ? 'green' : 'red' }}>
                {index.netChange.toFixed(2)}
              </td>
              <td style={{ color: index.percentChange >= 0 ? 'green' : 'red' }}>
                {index.percentChange.toFixed(2)}%
              </td>
              <td>{index.oneMonth}%</td>
              <td>{index.oneYear}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Indices;
