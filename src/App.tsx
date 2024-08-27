import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Pages/LoginPage/Login';
import Dashboard from './components/DashboardComponent/Dashboard';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import MarketCalendar from './components/MarketCalendar';
import Transactions from './components/Transactions';
import SectorsPage from './components/Pages/SectorsPage/SectorsPage';
import Sidebar from './components/SidebarComponent/Sidebar';

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
    <div className="main-container">
      <header className="navbar">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} handleLogoClick={handleLogoClick} />
      </header>
      {/* <div><Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /></div> */}
      <main className="content-container">
        <Routes>
          <Route path="/" element={<Login onSuccess={handleLoginSuccess} />} />
          <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} isSidebarOpen={isSidebarOpen} />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/market-calendar" element={<MarketCalendar />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/sectors" element={<SectorsPage />} />
        </Routes>
      </main>
      <div><Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /></div>
    </div>
  );
};

export default App;