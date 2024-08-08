import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-16'
      }`} 
      style={{ zIndex: 1000 }} // Ensure sidebar is on top of other components
    >
      <button 
        className="text-white p-4 focus:outline-none"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <nav className={`mt-4 ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="space-y-2">
          <li><Link to="/watchlist" className="block p-4 border-l-4 border-transparent hover:border-green-500">Watchlist</Link></li>
          <li><Link to="/portfolio" className="block p-4 border-l-4 border-transparent hover:border-green-500">Portfolio</Link></li>
          <li><Link to="/market-calendar" className="block p-4 border-l-4 border-transparent hover:border-green-500">Market Calendar</Link></li>
          <li><Link to="/transactions" className="block p-4 border-l-4 border-transparent hover:border-green-500">Transactions</Link></li>
          <li><Link to="/sectors" className="block p-4 border-l-4 border-transparent hover:border-green-500">Sectors</Link></li>
          <li><Link to="/account" className="block p-4 border-l-4 border-transparent hover:border-green-500">Account</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
