import React from 'react';
import { Link } from 'react-router-dom';
import TickerSection from './TickerSection'; // Import the TickerSection component

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button className="p-2 focus:outline-none">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <Link to="/" className="text-xl font-bold text-white ml-2">Invest the Nest</Link>
      </div>
      <div className="flex-grow flex items-center space-x-6">
        <input 
          type="text" 
          placeholder="Search" 
          className="px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none w-full md:max-w-md"
        />
      </div>
      <div className="flex items-center space-x-4">
       
        <Link to="/login" className="text-white border-2 border-white px-4 py-2 rounded hover:bg-gray-700">Login</Link>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
