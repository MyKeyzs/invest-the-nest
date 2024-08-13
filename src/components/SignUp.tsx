import React, { useState } from 'react';
import './SignUp.css';

const SignUp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleGmailLink = () => {
    // Function to handle Gmail linking, typically integrating with Google's OAuth
    window.location.href = 'https://accounts.google.com/o/oauth2/auth?...'; // Google OAuth URL with necessary parameters
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="signup-page">
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Account</h2>
            <p>Please link your Gmail account to create your account.</p>
            <button onClick={handleGmailLink} className="gmail-button">
              Link Gmail Account
            </button>
            <button onClick={closeModal} className="close-button">
              Close
            </button>
          </div>
        </div>
      )}
      {/* Additional content for the sign-up page, if needed */}
    </div>
  );
};

export default SignUp;