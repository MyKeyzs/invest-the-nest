import React from 'react';
import TopTickers from './TopTickers';
import Chart from './Chart';
import Positions from './Positions';
import Sidebar from './Sidebar';
import GroupedBars from './GroupedBars';

const Dashboard: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow p-6 bg-gray-900 text-white">
        <div className="mb-6">
          <TopTickers />
        </div>
        <div className="flex mb-6">
          <div className="flex-grow">
            <Chart />
          </div>
          <div className="ml-6 w-1/4">
            <Positions />
          </div>
        </div>
        <div className="mt-6">
          <GroupedBars />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
