import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Ensure this path matches your project's structure

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        className="menu-button p-2 focus:outline-none"
        onClick={toggleSidebar}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-button p-2 focus:outline-none" onClick={toggleSidebar}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <nav className="flex flex-col space-y-6">
          <Link to="/portfolio" className="u-hover--sparkle sparkle hover:text-blue-500">Portfolio</Link>
          <Link to="/history" className="u-hover--sparkle sparkle hover:text-blue-500">History</Link>
          <Link to="/sign-out" className="u-hover--sparkle sparkle hover:text-blue-500">Sign Out</Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
