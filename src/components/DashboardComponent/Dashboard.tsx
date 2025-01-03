import React, { useState, useRef } from 'react';
import RGL, { Responsive, WidthProvider, type Layout } from 'react-grid-layout';
import TopTickers from '../TopTickersComponent/TopTickers';
import Positions from '../PositionsComponent/Positions';
import Chart from '../ChartComponent/Chart';
import GroupedBars from '../GroupedBars/GroupedBars';
import GainersAndLosers from '../GainersAndLosersComponent/GainersAndLosers';
import Indices from '../IndicesComponent/Indices';
import QuickNews from '../QuickNews/QuickNews';
import './Dashboard.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface DashboardProps {
  isLoggedIn: boolean;
  isSidebarOpen: boolean;
}

const generateLayout = (): Layout[] => {
  return [
    { i: 'positions', x: 0, y: 0, w: 3, h: 15 },
    { i: 'chart-1', x: 3, y: 0, w: 4, h: 15, isResizable: false }, // Adjust 'w' and 'h' as needed
    { i: 'gainersLosers', x: 7, y: 0, w: 3, h: 10.5 },
    {i: 'quickNews', x:7, y: 0, w:3, h:4},
    { i: 'groupedBars', x: 4, y: 10, w: 5, h: 11 },
    { i: 'indices', x: 0, y: 18, w: 4, h: 4 },
  ];
};

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn, isSidebarOpen }) => {
  const [selectedTicker, setSelectedTicker] = useState<string>('SPY');
  const [layout, setLayout] = useState<Layout[]>(generateLayout());
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg');
  const [compactType, setCompactType] = useState<"vertical" | "horizontal" | null>(null); // No compaction
  const [isLocked, setIsLocked] = useState<boolean>(true); // Widgets are locked by default
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSelectTicker = (ticker: string) => {
    setSelectedTicker(ticker);
    if (chartRef.current) {
      window.scrollTo({
        top: chartRef.current.offsetTop - 100,
        behavior: 'smooth',
      });
    }
  };

  const handleBarClick = (ticker: string) => {
    setSelectedTicker(ticker);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
  };

  const onBreakpointChange = (newBreakpoint: string) => {
    setCurrentBreakpoint(newBreakpoint);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked); // Toggle lock/unlock state
  };

  return (
    <div className="dashboard">
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <button className="lock-button" onClick={toggleLock}>
          {isLocked ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-lock" viewBox="0 0 16 16">
              <path d="M8 1a4 4 0 0 0-4 4v3H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm-3 7V5a3 3 0 0 1 6 0v3H5zm0 4v3a1 1 0 1 0 2 0v-3a1 1 0 1 0-2 0z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-unlock" viewBox="0 0 16 16">
              <path d="M11 1a2 2 0 0 1 2 2v3h-1V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2H5V3a2 2 0 0 1 2-2h4z"/>
              <path d="M1 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8zm2-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H3z"/>
            </svg>
          )}
        </button>

        {isLoggedIn && (
          <ResponsiveReactGridLayout
          className="layout"
          layouts={{ lg: layout }}
          onLayoutChange={onLayoutChange}
          onBreakpointChange={onBreakpointChange}
          compactType="vertical" // Allows widgets to move vertically when dragged
          preventCollision={false} // Disable collision prevention, enabling auto-repositioning
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30} 
          isDraggable={!isLocked}
          isResizable={!isLocked}
        >
            <div key="chart-1" className="widget" ref={chartRef} >
              <Chart ticker={selectedTicker} />
            </div>
            <div key="positions" className="widget">
              <Positions onSelectTicker={handleSelectTicker} />
            </div>
            <div key="gainersLosers" className="widget">
              <GainersAndLosers onSelectTicker={handleSelectTicker} />
            </div>
            <div key="quickNews" className="widget">
             <QuickNews ticker={selectedTicker} />
            </div>
            <div key="groupedBars" className="widget">
              <GroupedBars onBarClick={handleBarClick} />
            </div>
            <div key="indices" className="widget">
              <Indices />
            </div>
          </ResponsiveReactGridLayout>
        )}
      </div>
    </div>
  );
};

export default Dashboard;