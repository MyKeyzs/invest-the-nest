import React from 'react';

const Positions: React.FC = () => {
  const positions = [
    { symbol: 'AAPL', value: 71.91 },
    { symbol: 'GOOGL', value: 23.93 },
    { symbol: 'MSFT', value: 126.16 },
    { symbol: 'AMZN', value: 35.27 },
    { symbol: 'TSLA', value: 94.20 },
  ];

  return (
    <div className="bg-gray-900 text-white p-4 rounded-md">
      <h2 className="text-lg font-bold">Positions</h2>
      <ul>
        {positions.map((position) => (
          <li key={position.symbol} className="flex justify-between">
            <span>{position.symbol}</span>
            <span>{position.value.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Positions;
