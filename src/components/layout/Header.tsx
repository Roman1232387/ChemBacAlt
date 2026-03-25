import React from 'react';
import { Link } from 'react-router-dom';

const ChemLogo = () => (
  <svg
    width="32" height="32" viewBox="0 0 38 38" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ animation: 'atom-spin 10s linear infinite', flexShrink: 0 }}
  >
    <style>{`
      @keyframes atom-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `}</style>
    <ellipse cx="19" cy="19" rx="17" ry="7" stroke="var(--teal)" strokeWidth="1.5" opacity="0.85" />
    <ellipse cx="19" cy="19" rx="17" ry="7" stroke="var(--teal)" strokeWidth="1.5" opacity="0.85" transform="rotate(60 19 19)" />
    <ellipse cx="19" cy="19" rx="17" ry="7" stroke="var(--teal)" strokeWidth="1.5" opacity="0.85" transform="rotate(120 19 19)" />
    <circle cx="19" cy="19" r="4" fill="var(--teal)" opacity="0.95" />
    <circle cx="19" cy="12" r="2" fill="white" opacity="0.9" />
    <circle cx="25.5" cy="23" r="2" fill="white" opacity="0.9" />
    <circle cx="12.5" cy="23" r="2" fill="white" opacity="0.9" />
  </svg>
);

export function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ChemLogo />
          <div style={{
            background: 'var(--teal-dim)', border: '1px solid rgba(0,212,170,0.3)',
            borderRadius: 'var(--r-md)', padding: '4px 12px',
            fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700,
            display: 'flex', alignItems: 'baseline', gap: 2,
          }}>
            <span style={{ color: 'var(--text-primary)' }}>Chem</span>
            <span style={{ color: 'var(--teal)' }}>BAC</span>
          </div>
        </div>
      </Link>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Platforma de Pregătire Bacalaureat Chimie
      </div>
    </header>
  );
}

export function PublicHeader() {
  return (
    <header style={{
      padding: '20px 40px', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', opacity: 1 }}>
        <span style={{ fontSize: '1.8rem', color: 'var(--teal)' }}>⚗</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          ChimieBAC
        </span>
      </Link>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        Bacalaureat 2025
      </span>
    </header>
  );
}
