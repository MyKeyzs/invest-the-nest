import React from 'react';
import ReactDOM from 'react-dom/client';
//import './output.css'; // Import the generated Tailwind CSS
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

const clientId = "840424813504-76is67v0uhsb2r92g91kltdd765416p9.apps.googleusercontent.com";
const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
      <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);