import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__icon">⚗</span>
        <span>ChimieBAC &copy; {new Date().getFullYear()}</span>
      </div>
      <span>Platforma de pregatire Bacalaureat Chimie &middot; Romania</span>
    </footer>
  );
}
