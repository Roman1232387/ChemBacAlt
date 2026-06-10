import React from 'react';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__icon">
          <svg width="20" height="20" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9"/>
            <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(60 19 19)"/>
            <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(120 19 19)"/>
            <circle cx="19" cy="19" r="3.5" fill="#00d4aa"/>
            <circle cx="19" cy="2" r="2" fill="white" opacity="0.95"/>
            <circle cx="32.7" cy="10.5" r="2" fill="white" opacity="0.95"/>
            <circle cx="5.3" cy="10.5" r="2" fill="white" opacity="0.95"/>
          </svg>
        </span>
        <span>ChemBAC &copy; {new Date().getFullYear()}</span>
      </div>
      <span>Platforma de pregatire Bacalaureat Chimie &middot; Moldova</span>
    </footer>
  );
}
