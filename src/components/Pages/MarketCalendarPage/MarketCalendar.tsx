import React, { useState, useEffect } from "react";
import "./MarketCalendar.css";
import earningsData from "./earnings.json"; // Import your manually populated JSON file

interface EarningsEntry {
  date: string;
  premarket: Company[];
  afterhours: Company[];
}

interface Company {
  name: string;
  ticker: string;
  logo: string;
}

const MarketCalendar: React.FC = () => {
  const [earnings, setEarnings] = useState<EarningsEntry[]>([]);

  useEffect(() => {
    setEarnings(earningsData); // Load earnings from JSON file
  }, []);

  return (
    <div className="calendar-container">
      {earnings.map((entry) => (
        <div className="day-column" key={entry.date}>
          <div className="date-header">{entry.date}</div>

          <div className="earnings-section">
            <div className="section-header">PREMARKET</div>
            {entry.premarket.length > 0 ? (
              <div className="earnings-list">
                {entry.premarket.map((company) => (
                  <div className="company" key={company.ticker}>
                    <img src={company.logo} alt={company.name} className="company-logo" />
                    <span className="company-ticker">{company.ticker}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-earnings">No earnings to display</p>
            )}
          </div>

          <div className="earnings-section">
            <div className="section-header">AFTERHOURS</div>
            {entry.afterhours.length > 0 ? (
              <div className="earnings-list">
                {entry.afterhours.map((company) => (
                  <div className="company" key={company.ticker}>
                    <img src={company.logo} alt={company.name} className="company-logo" />
                    <span className="company-ticker">{company.ticker}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-earnings">No earnings to display</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MarketCalendar;
