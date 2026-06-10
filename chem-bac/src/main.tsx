import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
const savedTheme = localStorage.getItem('chembac_theme');
if (savedTheme === 'light') {
  document.body.classList.add('light-mode');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
