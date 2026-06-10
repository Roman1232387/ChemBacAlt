import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface NavItem { to: string; icon: string; label: string; }

const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', icon: '🏠', label: 'Acasă' },
  { to: '/lectii', icon: '📚', label: 'Lecții' },
  { to: '/teme', icon: '💎', label: 'Teme BAC' },
  { to: '/teste', icon: '📝', label: 'Teste' },
];

const SECONDARY_NAV: NavItem[] = [
  { to: '/rezultate', icon: '📊', label: 'Rezultatele mele' },
  { to: '/resurse', icon: '📥', label: 'Resurse' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const navigate = useNavigate();
  const location = useLocation();

  const isTakingTest = location.pathname.startsWith('/teste/') && 
                       !location.pathname.startsWith('/teste/admin') && // though admin path is /admin/teste
                       location.pathname.split('/').filter(Boolean).length === 2;

  const handleLogout = () => { 
    if (isTakingTest && !window.confirm('Ești sigur că vrei să te deconectezi? Testul curent va fi pierdut.')) return;
    logout(); 
    navigate('/login'); 
  };

  const handleNavClick = (to: string) => (e: React.MouseEvent) => {
    if (isTakingTest && location.pathname !== to) {
      if (!window.confirm('Ești sigur că vrei să părăsești testul? Progresul tău neverificat se va pierde.')) {
        e.preventDefault();
      }
    }
  };

  const renderLinks = (items: NavItem[]) => items.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={handleNavClick(item.to)}
      className={({ isActive }) =>
        `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
      }
    >
      <span className="sidebar__link-icon">{item.icon}</span>
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <aside className="sidebar">
      <div className="sidebar__logo" onClick={(e) => {
        if (isTakingTest) {
          if (!window.confirm('Ești sigur că vrei să părăsești testul?')) return;
        }
        navigate('/');
      }} style={{ cursor: 'pointer' }}>
        <div className="sidebar__logo-icon">
          <svg width="28" height="28" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9"/>
            <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(60 19 19)"/>
            <ellipse cx="19" cy="19" rx="17" ry="7" stroke="#00d4aa" strokeWidth="1.8" opacity="0.9" transform="rotate(120 19 19)"/>
            <circle cx="19" cy="19" r="3.5" fill="#00d4aa"/>
            <circle cx="19" cy="2" r="2" fill="white" opacity="0.95"/>
            <circle cx="32.7" cy="10.5" r="2" fill="white" opacity="0.95"/>
            <circle cx="5.3" cy="10.5" r="2" fill="white" opacity="0.95"/>
          </svg>
        </div>
        <div>
          <div className="sidebar__logo-title">ChemBAC</div>
          <div className="sidebar__logo-sub">Pregătire BAC</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <div className="sidebar__section">Meniu</div>
        {renderLinks(MAIN_NAV)}

        <div className="sidebar__section">Progres și resurse</div>
        {renderLinks(SECONDARY_NAV)}

        {isAdmin && <div className="sidebar__section">Administrare</div>}
        {isAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <NavLink
              to="/admin/lectii"
              onClick={handleNavClick('/admin/lectii')}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
              style={({ isActive }) => isActive ? { borderLeftColor: 'var(--amber)', color: 'var(--amber)', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, transparent 100%)' } : {}}
            >
              <span className="sidebar__link-icon" style={{ color: 'var(--amber)' }}>🛠️</span>
              <span>Lecții Admin</span>
            </NavLink>
            <NavLink
              to="/admin/teste"
              onClick={handleNavClick('/admin/teste')}
              className={({ isActive }) =>
                `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
              }
              style={({ isActive }) => isActive ? { borderLeftColor: 'var(--amber)', color: 'var(--amber)', background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, transparent 100%)' } : {}}
            >
              <span className="sidebar__link-icon" style={{ color: 'var(--amber)' }}>⚙️</span>
              <span>Teste Admin</span>
            </NavLink>
          </div>
        )}
      </nav>

      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user.avatarInitials}</div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user.name}</div>
              <div className="sidebar__user-role">
                {user.role === 'admin' ? 'Administrator' : 'Elev'}
              </div>
            </div>
          </div>
        )}
        <button className="sidebar__logout" onClick={handleLogout}>
          <span>🚪</span> Deconectare
        </button>
      </div>
    </aside>
  );
}
