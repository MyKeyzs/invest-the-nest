import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button className="p-2 focus:outline-none md:hidden">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <Link to="/" className="text-xl font-bold text-white pl-4">Invest the Nest</Link>
      </div>
      <div className="hidden md:flex flex-grow items-center px-6">
        <input 
          type="text" 
          placeholder="Search" 
          className="px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none w-full"
        />
      </div>
      <div className="hidden md:flex space-x-6">
        <Link to="/watchlist" className="text-white hover:text-gray-400">Watchlist</Link>
        <Link to="/portfolio" className="text-white hover:text-gray-400">Portfolio</Link>
        <Link to="/market-calendar" className="text-white hover:text-gray-400">Market Calendar</Link>
        <Link to="/transactions" className="text-white hover:text-gray-400">Transactions</Link>
        <Link to="/sectors" className="text-white hover:text-gray-400">Sectors</Link>
        <Link to="/account" className="text-white hover:text-gray-400">Account</Link>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;