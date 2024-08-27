import React, { useState, useRef } from 'react';
import TopTickers from '../TopTickersComponent/TopTickers';
import Positions from '../PositionsComponent/Positions';
import Sidebar from '../SidebarComponent/Sidebar';
import ChartComponentWrapped from '../ChartComponent/Chart'; 
import GroupedBars from '../GroupedBars/GroupedBars';
import GainersAndLosers from '../GainersAndLosersComponent/GainersAndLosers';
import './Dashboard.css';

interface DashboardProps {
  isLoggedIn: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn }) => {
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTicker(ticker);
    // Scroll to the chart component
    if (chartRef.current) {
      window.scrollTo({
        top: chartRef.current.offsetTop - 100, // Scroll a bit higher than the chart
        behavior: 'smooth',
      });
    }
  };

  const handleBarClick = (ticker: string) => {
    setSelectedTicker(ticker);
    
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Optional: smooth scrolling
    });
  };

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
              <div className="w-2-3"> {/* 2/3 width for the chart */}
                <div ref={chartRef}>
                  <ChartComponentWrapped ticker={selectedTicker} />
                </div>
              </div>
              <div className="ml-6 w-1-3"> {/* 1/3 width for positions */}
                <Positions onSelectTicker={setSelectedTicker} />
              </div>
            </div>
            <div className="widget mt-6 flex">
              <div className="w-1-3 mr-2"> {/* Reduced right margin for Gainers and Losers */}
                <GainersAndLosers onSelectTicker={handleSelectTicker} />
              </div>
              <div className="w-2-3"> {/* 2/3 width for GroupedBars */}
                <GroupedBars onBarClick={handleBarClick} />
              </div>
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
