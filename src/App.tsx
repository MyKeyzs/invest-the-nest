import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Pages/LoginPage/Login';
import Dashboard from './components/Dashboard';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import MarketCalendar from './components/MarketCalendar';
import Transactions from './components/Transactions';
import Sectors from './components/Sectors';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/home');
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
      <main className="content-container">
        <Routes>
          <Route path="/" element={<Login onSuccess={handleLoginSuccess} />} />
          <Route path="/home" element={<Dashboard isLoggedIn={isLoggedIn} />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/market-calendar" element={<MarketCalendar />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/sectors" element={<Sectors />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;