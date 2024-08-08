import React, { useState } from 'react';
import TopTickers from './TopTickers';
import Chart from './Chart';
import Positions from './Positions';
import Sidebar from './Sidebar';
import GroupedBars from './GroupedBars';
import './Dashboard.css'; // Ensure you have the CSS file imported

const Dashboard: React.FC = () => {
  // State to track sidebar open/closed status
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <div className="widget ticker-container">
          <TopTickers />
        </div>
        <div className="widget flex">
          <div className="flex-grow">
            <Chart />
          </div>
          <div className="ml-6 w-1/4">
            <Positions />
          </div>
        </div>
        <div className="widget mt-6">
          <GroupedBars />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
