import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import './Login.css';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    // Mock validation for example purposes
    if (email === 'user@example.com' && password === 'password123') {
      setErrorMessage('');
      onSuccess(); // Simulate successful login
    } else {
      setErrorMessage('The Username/Password given does not match any valid records');
    }
  };

  const handleGoogleSuccess = (response: CredentialResponse) => {
    console.log('Google login successful:', response);
    onSuccess(); // Handle successful login
  };

  const handleGoogleFailure = () => {
    console.error('Google login failed.');
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login to Invest the Nest</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={handleLogin}
              className="login-button"
            >
              Login
            </button>
          </div>
          <div className="form-group">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => handleGoogleFailure()} // Anonymous function wrapper to satisfy the expected type
              ux_mode="popup"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
