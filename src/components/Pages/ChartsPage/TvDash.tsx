import React, { useState } from 'react';
import TvChart from './TvChart';

const TvDash: React.FC = () => {
  const [tickers] = useState(['SPY', 'QQQ', 'IWM', 'UUP', 'USO', 'TLT']); // Predefined tickers

  return (
    <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridGap: '50px' }}>
      {tickers.map((ticker) => (
        <div key={ticker}>
          <h4>{ticker}</h4>
          <TvChart ticker={ticker} interval="D" chartType="candlestick" />
        </div>
      ))}
    </div>
  );
};

export default TvDash;
