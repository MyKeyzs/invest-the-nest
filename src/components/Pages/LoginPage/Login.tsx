import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Login.css';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [signUpErrorMessage, setSignUpErrorMessage] = useState(''); // State for sign-up error

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      setErrorMessage('');
      onSuccess();
    } catch (error) {
      setErrorMessage('Invalid email or password. Please try again.');
      console.error('Error logging in:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      const user = userCredential.user;

      // Add user details to Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        username: newUsername,
        email: newEmail,
        createdAt: new Date(),
        stocksOwned: []
      });

      console.log('User created and saved in Firestore!');
      alert('Account created successfully!');
      setShowModal(false); // Close the modal after account creation
      setSignUpErrorMessage(''); // Clear the error message
    } catch (error: any) {
      setSignUpErrorMessage(error.message); // Set the error message for sign-up
      console.error('Error creating user:', error);
    }
  };

  const handleGoogleSuccess = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      if (user) {
        const userDocRef = doc(db, 'Users', user.uid);
        const userDoc = await getDoc(userDocRef);
  
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            username: user.displayName || 'Anonymous',
            email: user.email,
            createdAt: new Date(),
            stocksOwned: []
          });
        }
  
        console.log('Google login successful:', user);
        onSuccess(); // Ensure this updates state or redirects
      }
    } catch (error) {
      console.error('Error handling Google sign-in:', error);
      setErrorMessage('Google login failed. Please try again.');
    }
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
            <button type="button" onClick={handleLogin} className="login-button">
              Login
            </button>
          </div>
          <div className="form-group">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
              ux_mode="popup"
            />
          </div>
          <div className="form-group">
            <button type="button" className="create-account-button" onClick={() => setShowModal(true)}>
              Create Account
            </button>
          </div>
        </form>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Account</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <button onClick={handleSignUp} className="create-account-button">
                Create Account
              </button>
              <button onClick={() => setShowModal(false)} className="cancel-button">
                Cancel
              </button>
            </div>
            {signUpErrorMessage && <p className="error-message">{signUpErrorMessage}</p>} {/* Display error message */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
