import React from 'react';
import ReactDOM from 'react-dom/client';
import './output.css'; // Import the generated Tailwind CSS
import App from './App';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);