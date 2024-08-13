import React from 'react';

interface LogoutProps {
  handleLogout: () => void;
}

const Logout: React.FC<LogoutProps> = ({ handleLogout }) => {
  const onLogoutClick = () => {
    handleLogout();
  };

  return (
    <div>
      <button onClick={onLogoutClick}>Logout</button>
    </div>
  );
};

export default Logout;
