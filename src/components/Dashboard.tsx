import React, { useState } from 'react';
import TopTickers from './TopTickers';
import Positions from './Positions';
import Sidebar from './Sidebar';
import ChartComponentWrapped from './Chart';  // Adjust import path if necessary
import GroupedBars from './GroupedBars';
import './Dashboard.css';

interface DashboardProps {
  onSelectTicker: (symbol: string) => void;
  selectedTicker: string;
  isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectTicker, selectedTicker, isLoggedIn }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="widget ticker-container">
          <TopTickers />
        </div>
        {isLoggedIn ? (
          <>
            <div className="widget flex">
              <div className="flex-grow">
                <ChartComponentWrapped ticker={selectedTicker} />
              </div>
              <div className="ml-6 w-1/4">
                <Positions onSelectTicker={onSelectTicker} />
              </div>
            </div>
            <div className="widget mt-6">
              <GroupedBars />
            </div>
          </>
        ) : (
          <p>Please log in to view your dashboard.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
