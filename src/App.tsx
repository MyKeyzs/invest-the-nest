import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Pages/LoginPage/Login';
import Dashboard from './components/DashboardComponent/Dashboard';
import './components/DashboardComponent/Dashboard.css';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import MarketCalendar from './components/Pages/MarketCalendarPage/MarketCalendar';
import Transactions from './components/Transactions';
import Sidebar from './components/SidebarComponent/Sidebar';
import NewsPage from './components/Pages/NewsPage/News';
import TvDash from './components/Pages/ChartsPage/TvDash';
import './App.css'; // Ensure to import your CSS file here
import CustomSectorsPage from './components/Pages/CustomSectors/CustomSectorsPage';
import FiscalOverviewPage from './components/Pages/FiscalOverview/FiscalOverviewPage';
import QuickNews from './components/QuickNews/QuickNews';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className={`main-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${!isLoggedIn ? 'no-sidebar' : ''}`}>
      <header className="navbar">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLogoClick={handleLogoClick} />
      </header>
      {isLoggedIn && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
      <main className="content-container">
        <Routes>
          <Route path="/" element={<Login onSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} isSidebarOpen={isSidebarOpen} />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/fiscal-overview" element={<FiscalOverviewPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/market-calendar" element={<MarketCalendar />} />
          <Route path="/more-charts" element={<TvDash />} />
          <Route path="/custom-sectors" element={<CustomSectorsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
