import React, { useEffect, useState } from "react";
import "./centralBankRate.css"; // Include styling if necessary
import centralBankData from "./centralBankRate.json"; // Import JSON data

interface CentralBankRate {
  bank: string;
  rate: string;
  nextMeeting: string;
  flag: string; // Add flag property
}

const CentralBankRate: React.FC = () => {
  const [data, setData] = useState<CentralBankRate[]>([]);

  useEffect(() => {
    // Load the data from the JSON file
    setData(centralBankData);
  }, []);

  return (
    <div className="central-bank-rate-container">
      <h2 className="central-bank-rate-title">Central Bank Rates</h2>
      <div className="central-bank-rate-table-wrapper">
        <table className="central-bank-rate-table">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Central Bank</th>
              <th>Rate</th>
              <th>Next Meeting</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={row.flag}
                    alt={`${row.bank} Flag`}
                    className="flag-icon"
                  />
                </td>
                <td>{row.bank}</td>
                <td>{row.rate}</td>
                <td>{row.nextMeeting}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CentralBankRate;
