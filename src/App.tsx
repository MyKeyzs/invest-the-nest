import React from 'react';
import './tailwind.css'; // Ensure this path matches your project's structure
import './components/Sidebar.css'; // Ensure this path matches your project's structure
import './components/Dashboard.css'; // Ensure this path matches your project's structure
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import MarketCalendar from './components/MarketCalendar';
import Transactions from './components/Transactions';
import Sectors from './components/Sectors';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
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
