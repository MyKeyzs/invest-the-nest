import React from 'react';
import Sidebar from './Sidebar';
import TopTickers from './TopTickers';
import Chart from './Chart';
import Positions from './Positions';
import './Dashboard.css'; // Ensure this path matches your project's structure

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-6 space-y-6 transition-all duration-500">
        <div className="space-y-6">
          <div className="w-full"><TopTickers /></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><Chart /></div>
            <div><Positions /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
