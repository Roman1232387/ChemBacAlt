import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ResultService } from '../services/ResultService';
import type { Result } from '../models/Result';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ total: 0, avg: 0, passed: 0, lastScore: 0 });
  const [recentResults, setRecentResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const resultsPromise = user.role === 'admin' 
      ? ResultService.getAll() 
      : ResultService.getByUser(user.id);

    resultsPromise.then(results => {
      if (results.length > 0) {
        const sorted = [...results].sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime());
        const total = results.length;
        const avg = Math.round(results.reduce((s, r) => s + r.percentage, 0) / total);
        const passed = results.filter(r => r.passed).length;
        setStats({ total, avg, passed, lastScore: sorted[0].percentage });
        setRecentResults(sorted.slice(0, 3));
      }
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="profile-page-container">
      <div className="profile-header-new">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {(user?.name?.[0] || 'U').toUpperCase()}
          </div>
        </div>
        <div className="profile-header-info">
          <div className="profile-badges">
            <span className="profile-badge-role">
              {user?.role === 'admin' ? 'Administrator' : 'Elev'}
            </span>
          </div>
          <h1 className="profile-name">{user?.name}</h1>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-main-col">
          <div className="profile-section">
            <h3 className="section-title">Performanță Academică</h3>
            <div className="stats-cards-new">
              <div className="stat-card-new">
                <div className="stat-icon bg-blue">📊</div>
                <div className="stat-data">
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Teste Susținute</span>
                </div>
              </div>
              <div className="stat-card-new">
                <div className="stat-icon bg-teal">🎯</div>
                <div className="stat-data">
                  <span className="stat-value">{stats.avg}%</span>
                  <span className="stat-label">Scor Mediu</span>
                </div>
              </div>
              <div className="stat-card-new">
                <div className="stat-icon bg-green">✅</div>
                <div className="stat-data">
                  <span className="stat-value">{stats.passed}</span>
                  <span className="stat-label">Promovate</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="section-header">
              <h3 className="section-title">Activitate Recentă</h3>
              <Link to="/rezultate" className="btn-link">Vezi tot istoricul</Link>
            </div>
            {recentResults.length > 0 ? (
              <div className="recent-list">
                {recentResults.map(r => (
                  <div key={r.id} className="recent-item">
                    <div className={`recent-status ${r.passed ? 'is-passed' : 'is-failed'}`}>
                      {r.passed ? '✓' : '✕'}
                    </div>
                    <div className="recent-info">
                      <div className="recent-title">Test Finalizat</div>
                      <div className="recent-date">{new Date(r.completedAt || r.startedAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div className={`recent-score ${r.passed ? 'text-green' : 'text-red'}`}>
                      {r.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>Nu ai susținut încă niciun test.</p>
                <Link to="/teste" className="btn btn-primary btn-sm">Începe Primul Test</Link>
              </div>
            )}
          </div>
        </div>

        <div className="profile-side-col">
          <div className="profile-section">
            <h3 className="section-title">Setări Rapide</h3>
            <div className="quick-actions">
              <Link to="/setari" className="action-btn">
                <span className="action-icon">⚙️</span>
                <span>Configurare Cont</span>
              </Link>
              <Link to="/resurse" className="action-btn">
                <span className="action-icon">📚</span>
                <span>Materiale Studiu</span>
              </Link>
              <button onClick={() => logout()} className="action-btn logout">
                <span className="action-icon">🚪</span>
                <span>Deconectare</span>
              </button>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Informații Cont</h3>
            <div className="info-list">
              <div className="info-item">
                <label>Membru din</label>
                <span>Iunie 2024</span>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className="text-green">Activ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-page-container {
          padding: 0;
          animation: fadeIn 0.4s ease-out;
        }
        .profile-hero {
          position: relative;
          padding: 60px 48px;
          margin: -24px -24px 60px -24px;
          background: linear-gradient(to bottom, var(--bg-surface), var(--bg-card));
          border-bottom: 1px solid var(--border);
        }
        .profile-hero__content {
          display: flex;
          align-items: center;
          gap: 32px;
        }
        .profile-avatar-wrap {
          position: relative;
        }
        .profile-avatar {
          width: 140px;
          height: 140px;
          border-radius: 32px;
          background: var(--teal-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          border: 6px solid var(--bg-page);
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .profile-avatar-edit {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-elevated);
          border: 2px solid var(--bg-page);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .profile-avatar-edit:hover { background: var(--teal); }

        .profile-header-info { padding-bottom: 12px; }
        .profile-badges { display: flex; gap: 8px; margin-bottom: 8px; }
        .profile-badge-role {
          background: rgba(0, 212, 170, 0.1);
          color: var(--teal);
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .profile-badge-achievement {
          background: rgba(245, 158, 11, 0.1);
          color: var(--amber);
          padding: 2px 10px;
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
        }
        .profile-name { font-size: 2.2rem; font-family: var(--font-display); margin: 0; }
        .profile-email { color: var(--text-muted); margin: 0; font-size: 1rem; }

        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 32px;
          max-width: 1200px;
        }
        .profile-section {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 24px;
          margin-bottom: 24px;
        }
        .section-title { margin: 0 0 20px 0; font-size: 1.1rem; font-weight: 700; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

        .stats-cards-new { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .stat-card-new {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          padding: 16px;
          border-radius: var(--r-md);
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }
        .stat-icon.bg-blue { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }
        .stat-icon.bg-teal { background: rgba(0, 212, 170, 0.1); color: var(--teal); }
        .stat-icon.bg-green { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
        .stat-data { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.4rem; font-weight: 800; line-height: 1; }
        .stat-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-top: 4px; }

        .recent-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 12px;
          border-bottom: 1px solid var(--border);
        }
        .recent-item:last-child { border-bottom: none; }
        .recent-status {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
        }
        .recent-status.is-passed { background: rgba(34, 197, 94, 0.1); color: #4ade80; }
        .recent-status.is-failed { background: rgba(239, 68, 68, 0.1); color: #f87171; }
        .recent-info { flex: 1; }
        .recent-title { font-weight: 600; font-size: 0.9rem; }
        .recent-date { font-size: 0.75rem; color: var(--text-muted); }
        .recent-score { font-weight: 800; font-size: 1.1rem; }

        .quick-actions { display: flex; flex-direction: column; gap: 10px; }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          text-decoration: none;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s;
        }
        .action-btn:hover { border-color: var(--teal); transform: translateX(4px); }
        .action-btn.logout:hover { border-color: #ff4d4f; color: #ff4d4f; }

        .info-list { display: flex; flex-direction: column; gap: 12px; }
        .info-item { display: flex; justify-content: space-between; font-size: 0.9rem; }
        .info-item label { color: var(--text-muted); }
        .info-item span { font-weight: 600; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 900px) {
          .profile-content-grid { grid-template-columns: 1fr; }
          .profile-hero { margin-bottom: 120px; }
          .profile-hero__content { left: 50%; transform: translateX(-50%); flex-direction: column; align-items: center; text-align: center; bottom: -100px; }
        }
      `}</style>
    </div>
  );
}
