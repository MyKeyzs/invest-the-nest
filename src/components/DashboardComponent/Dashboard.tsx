import React, { useState, useRef } from 'react';
import RGL, { Responsive, WidthProvider, type Layout } from 'react-grid-layout';
import TopTickers from '../TopTickersComponent/TopTickers';
import Positions from '../PositionsComponent/Positions';
import ChartComponentWrapped from '../ChartComponent/Chart';
import GroupedBars from '../GroupedBars/GroupedBars';
import GainersAndLosers from '../GainersAndLosersComponent/GainersAndLosers';
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
    { i: 'positions', x: 0, y: 0, w: 3, h: 13 },
    { i: 'chart', x: 3, y: 0, w: 6, h: 21 },
    { i: 'gainersLosers', x: 9, y: 0, w: 3, h: 23 },
    { i: 'groupedBars', x: 0, y: 10, w: 3, h: 12 },
  ];
};

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn, isSidebarOpen }) => {
  const [selectedTicker, setSelectedTicker] = useState<string>('AAPL');
  const [layout, setLayout] = useState<Layout[]>(generateLayout());
  const [isLocked, setIsLocked] = useState(false); // Control lock/unlock
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

  const toggleLock = () => {
    setIsLocked((prevLocked) => !prevLocked); // Toggle lock state
  };

  return (
    <div className="dashboard">
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Tickers */}
        <div className="top-ticker-widget top-tickers-container">
          <TopTickers />
        </div>

        {/* Lock/Unlock Button with Icons */}
        <div className="lock-buttons-container">
          <button className="lock-button" onClick={toggleLock}>
            {isLocked ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="16px" width="16px" version="1.1" id="Capa_1" viewBox="0 0 253.334 253.334">
              <g>
                <path d="M160.44,89.902H74.524V52.345C74.524,34.51,89.034,20,106.87,20s32.346,14.51,32.346,32.345V62.57c0,5.523,4.478,10,10,10   s10-4.477,10-10V52.345C159.215,23.482,135.733,0,106.87,0S54.524,23.482,54.524,52.345v37.557h-1.225   c-15.244,0-27.646,12.402-27.646,27.646v106.908c0,15.923,12.954,28.878,28.878,28.878h104.678   c15.924,0,28.878-12.955,28.878-28.878V117.548C188.087,102.304,175.684,89.902,160.44,89.902z M168.087,224.456   c0,4.896-3.982,8.878-8.878,8.878H54.531c-4.896,0-8.878-3.982-8.878-8.878V117.548c0-4.216,3.431-7.646,7.646-7.646H160.44   c4.216,0,7.646,3.43,7.646,7.646V224.456z"/>
                <path d="M106.87,134.44c-11.409,0-20.691,9.282-20.691,20.691c0,7.783,4.324,14.57,10.691,18.102v25.562c0,5.523,4.478,10,10,10   s10-4.477,10-10v-25.562c6.368-3.532,10.691-10.319,10.691-18.102C127.561,143.722,118.279,134.44,106.87,134.44z"/>
                <path d="M178.588,54.182c1.221,0.49,2.48,0.721,3.72,0.721c3.965,0,7.718-2.375,9.284-6.28l7.445-18.563   c2.056-5.126-0.433-10.948-5.559-13.004c-5.125-2.056-10.948,0.433-13.004,5.559l-7.445,18.563   C170.974,46.304,173.462,52.125,178.588,54.182z"/>
                <path d="M190.093,66.501c1.623,3.796,5.317,6.071,9.2,6.071c1.312,0,2.645-0.259,3.926-0.808l18.39-7.862   c5.078-2.171,7.436-8.047,5.265-13.126c-2.172-5.078-8.052-7.436-13.126-5.264l-18.39,7.862   C190.28,55.546,187.922,61.422,190.093,66.501z"/>
                <path d="M221.085,85.232l-18.563-7.445c-5.126-2.056-10.948,0.432-13.004,5.559c-2.056,5.126,0.433,10.948,5.559,13.004   l18.563,7.445c1.221,0.49,2.48,0.721,3.72,0.721c3.965,0,7.718-2.375,9.284-6.28C228.699,93.11,226.211,87.288,221.085,85.232z"/>
              </g>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-lock" viewBox="0 0 16 16">
                <path d="M8 1a4 4 0 0 0-4 4v3H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm-3 7V5a3 3 0 0 1 6 0v3H5zm0 4v3a1 1 0 1 0 2 0v-3a1 1 0 1 0-2 0z"/>
                  </svg>
            )}
            {isLocked ? ' Widgets are locked' : 'Widgets are unlocked'}
          </button>
        </div>

        {isLoggedIn && (
          <ResponsiveReactGridLayout
            className="layout"
            layouts={{ lg: layout }}
            onLayoutChange={onLayoutChange}
            preventCollision={!isLocked}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={30}
            isDraggable={!isLocked}
            isResizable={false}
          >
            <div key="positions" className="widget" style={{ height: '100%' }}>
              <Positions onSelectTicker={handleSelectTicker} />
            </div>
            <div key="chart" className="widget" ref={chartRef} style={{ height: '100%' }}>
              <ChartComponentWrapped ticker={selectedTicker} />
            </div>
            <div key="gainersLosers" className="widget" style={{ height: '100%' }}>
              <GainersAndLosers onSelectTicker={handleSelectTicker} />
            </div>
            <div key="groupedBars" className="widget" style={{ height: '100%' }}>
              <GroupedBars onBarClick={handleBarClick} />
            </div>
          </ResponsiveReactGridLayout>
        )}
      </div>
    </div>
  );
};

export default Dashboard
