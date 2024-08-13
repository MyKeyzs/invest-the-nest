import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import MarketCalendar from './components/MarketCalendar';
import Transactions from './components/Transactions';
import Sectors from './components/Sectors';
import Login from './components/Pages/LoginPage/Login';
import Logout from './components/Logout';
import { gapi } from 'gapi-script';

const clientId = "840424813504-76is67v0uhsb2r92g91kltdd765416p9.apps.googleusercontent.com";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: ""
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Login onSuccess={handleLogin} />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/market-calendar" element={<MarketCalendar />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/sectors" element={<Sectors />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
