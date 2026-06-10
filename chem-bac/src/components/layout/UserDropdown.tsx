import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-dropdown-container" ref={dropdownRef}>
      <div 
        className={`topbar__user-trigger ${isOpen ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="topbar__user-info">
          <div className="topbar__user-name">{user?.name || 'Utilizator'}</div>
          <div className="topbar__user-role">
            {user?.role === 'admin' ? 'Administrator' : 'Elev'}
          </div>
        </div>
        <div className="topbar__avatar">
          {(user?.name?.[0] || 'U').toUpperCase()}
        </div>
      </div>

      {isOpen && (
        <div className="dropdown-menu">
          <div style={{ padding: '8px 12px 16px', borderBottom: '1px solid var(--border)', marginBottom: 12 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
          
          <div className="dropdown-group" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Link to="/profil" className="dropdown-item-new" onClick={() => setIsOpen(false)}>
              <div className="dropdown-icon-wrap" style={{ background: 'rgba(0, 212, 170, 0.1)', color: 'var(--teal)' }}>👤</div> 
              <div className="dropdown-text">
                <span className="dropdown-label">Profilul meu</span>
                <span className="dropdown-sub">Vezi progresul tău</span>
              </div>
            </Link>
            <Link to="/setari" className="dropdown-item-new" onClick={() => setIsOpen(false)}>
              <div className="dropdown-icon-wrap" style={{ background: 'rgba(139, 155, 191, 0.1)', color: 'var(--text-secondary)' }}>⚙️</div> 
              <div className="dropdown-text">
                <span className="dropdown-label">Setări cont</span>
                <span className="dropdown-sub">Gestionare preferințe</span>
              </div>
            </Link>
            {isAdmin && (
              <Link to="/admin/lectii" className="dropdown-item-new" onClick={() => setIsOpen(false)}>
                <div className="dropdown-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--amber)' }}>🛡️</div> 
                <div className="dropdown-text">
                  <span className="dropdown-label">Panou Admin</span>
                  <span className="dropdown-sub">Acces rapid</span>
                </div>
              </Link>
            )}
          </div>
          
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 12, paddingTop: 12 }}>
            <button 
              className="dropdown-item-new logout-btn" 
              onClick={handleLogout}
            >
              <div className="dropdown-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--red)' }}>🚪</div> 
              <div className="dropdown-text">
                <span className="dropdown-label" style={{ color: 'var(--red)' }}>Deconectare</span>
                <span className="dropdown-sub">Închide sesiunea activă</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
