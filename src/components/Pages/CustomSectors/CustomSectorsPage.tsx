import React from 'react';
import CustomSectors from './CustomSectors';

const CustomSectorsPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', height: '100vh', width: '100%', overflow: 'auto' }}>
      <div style={{ height: '100%' }}>
        <CustomSectors />
      </div>
    </div>
  );
};

export default CustomSectorsPage;