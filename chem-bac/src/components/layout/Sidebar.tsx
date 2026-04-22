import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface NavItem { to: string; icon: string; label: string; }

const USER_NAV: NavItem[] = [
  { to: '/dashboard', icon: '⬡', label: 'Tablou de Bord' },
  { to: '/lectii',    icon: '◈', label: 'Lectii' },
  { to: '/teste',     icon: '◉', label: 'Teste' },
  { to: '/rezultate', icon: '◎', label: 'Rezultatele Mele' },
  { to: '/teme',      icon: '📚', label: 'Teme BAC' },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/dashboard',   icon: '⬡', label: 'Tablou de Bord' },
  { to: '/lectii',      icon: '◈', label: 'Lectii' },
  { to: '/teste',       icon: '◉', label: 'Teste' },
  { to: '/admin/teste', icon: '⬙', label: 'Admin – Teste' },
  { to: '/teme',       icon: '📚', label: 'Teme BAC' },
];

export function Sidebar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const nav = isAdmin ? ADMIN_NAV : USER_NAV;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-icon">⚗</span>
        <div>
          <div className="sidebar__logo-title">ChimieBAC</div>
          <div className="sidebar__logo-sub">Bacalaureat 2025</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        {isAdmin && <div className="sidebar__section">Meniu</div>}
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
            }
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        {user && (
          <div className="sidebar__user">
            <div className="sidebar__avatar">{user.avatarInitials}</div>
            <div>
              <div className="sidebar__user-name">{user.name}</div>
              <div className="sidebar__user-role">
                {user.role === 'admin' ? '👑 Administrator' : '🎓 Elev'}
              </div>
            </div>
          </div>
        )}
        <button className="btn btn-ghost btn-sm btn-full" onClick={handleLogout}>
          ⎋ Deconectare
        </button>
      </div>
    </aside>
  );
}
