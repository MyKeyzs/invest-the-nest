import React from 'react';

const PortfolioWidget: React.FC = () => {
  const portfolioValue = 451443;
  const percentageChange = 3.45;
  const changes = [
    { ticker: 'AAPL', change: 7.26, percentage: 4.33, shares: 132, valueChange: 3525.76 },
    { ticker: 'META', change: 3.28, percentage: 0.63, shares: 75, valueChange: 1343.76 },
    { ticker: 'MSFT', change: 4.58, percentage: 1.08, shares: 90, valueChange: 143043.76 },
    { ticker: 'NVDA', change: 35.48, percentage: 4.08, shares: 80, valueChange: 42343.76 }
  ];

  return (
    <div className="bg-gray-300 p-4 rounded-lg shadow-md">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-700">Current Portfolio</h3>
        <div className="text-4xl font-bold text-gray-900">${portfolioValue.toLocaleString()}</div>
        <div className={`text-xl font-semibold ${percentageChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentageChange >= 0 ? '+' : ''}{percentageChange}% today
        </div>
        <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Add New Transaction
        </button>
      </div>
      <div>
        <h4 className="text-gray-700 font-bold mb-2">Today's Changes</h4>
        <div className="space-y-2">
          {changes.map((change, index) => (
            <div key={index} className="bg-black text-white p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-bold">{change.ticker}</span>
                <span className={`font-bold ${change.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change.change >= 0 ? '+' : ''}{change.change} ({change.percentage}%)
                </span>
              </div>
              <div className="text-sm">
                <span>{change.shares} shares: </span>
                <span className={`font-bold ${change.valueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${change.valueChange.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioWidget;
