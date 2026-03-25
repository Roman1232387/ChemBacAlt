import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)', position: 'sticky', top: 0, zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          background: 'var(--teal-dim)', border: '1px solid rgba(0,212,170,0.3)',
          borderRadius: 'var(--r-md)', padding: '4px 12px',
          fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 700,
        }}>📚 ChemBac</div>
      </div>
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
      display: 'flex', alignItems: 'center',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', opacity: 1 }}>
        <span style={{ fontSize: '1.8rem', color: 'var(--teal)' }}>⚗</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
          ChimieBAC
        </span>
      </Link>
    </header>
  );
}
