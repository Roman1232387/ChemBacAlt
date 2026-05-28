import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LessonService } from '../services/LessonService';
import { TestService } from '../services/TestService';
import { ResultService } from '../services/ResultService';
import type { Lesson } from '../models/Lesson';
import type { Test } from '../models/Test';
import type { Result } from '../models/Result';
import { DIFFICULTY_LABELS } from '../models/Lesson';
import { HealthService } from '../services/HealthService';

export function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tests,   setTests]   = useState<Test[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string>('Verificare...');
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    HealthService.check()
        .then((msg) => setBackendStatus(msg))
        .catch(() => setBackendStatus('Backend indisponibil'));
  }, []);
  useEffect(() => {
    const load = async () => {
      try {
        setDataError(null);
        const [l, t] = await Promise.all([LessonService.getAll(), TestService.getAll()]);
        setLessons(l);
        setTests(t.filter((tt) => tt.status === 'published'));
        if (user) {
          const r = await ResultService.getByUser(user.id);
          setResults(r);
        }
      } catch {
        setLessons([]);
        setTests([]);
        setResults([]);
        setDataError('Datele nu au putut fi incarcate. Verifica daca API-ul si baza de date ruleaza.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const testMap = useMemo(() => Object.fromEntries(tests.map((t) => [t.id, t])), [tests]);
  const avgScore  = results.length ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0;
  const passCount = results.filter((r) => r.passed).length;

  if (loading) return <div className="state-center"><div className="spinner" /></div>;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <div className="welcome-banner__title">Buna, {user?.name.split(' ')[0]}! 👋</div>
          <p className="text-muted">
            {isAdmin
              ? 'Gestioneaza lectiile, testele si activitatea elevilor.'
              : 'Continua pregatirea pentru Bacalaureat la Chimie.'}
          </p>
        </div>
        {isAdmin
          ? <Link to="/admin/teste" className="btn btn-primary btn-lg">⬙ Administreaza Teste →</Link>
          : <Link to="/teste"       className="btn btn-primary btn-lg">Sustine un Test →</Link>}
      </div>
      <div style={{
        padding: '8px 14px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        marginBottom: 16,
      }}>
        Backend: {backendStatus}
      </div>
      {dataError && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          {dataError}
        </div>
      )}
      {/* Stats */}
      <div className="grid-stats mb-6">
        <div className="stat-card">
          <div className="stat-card__value">{lessons.length}</div>
          <div className="stat-card__label">Lectii disponibile</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__value">{tests.length}</div>
          <div className="stat-card__label">Teste publicate</div>
        </div>
        {!isAdmin && <>
          <div className="stat-card">
            <div className="stat-card__value">{results.length}</div>
            <div className="stat-card__label">Teste sustinute</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: avgScore >= 60 ? 'var(--green)' : 'var(--red)' }}>
              {avgScore}%
            </div>
            <div className="stat-card__label">Scor mediu</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value" style={{ color: 'var(--green)' }}>{passCount}</div>
            <div className="stat-card__label">Promovate</div>
          </div>
        </>}
      </div>

      {/* Recent Lessons */}
      <div className="flex justify-between items-center mb-4">
        <h3>Lectii recente</h3>
        <Link to="/lectii" className="btn btn-ghost btn-sm">Vezi toate →</Link>
      </div>
      <div className="grid-2 mb-8">
        {lessons.slice(0, 4).map((l) => (
          <Link key={l.id} to={`/lectii/${l.id}`} className="card card--link" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="flex justify-between items-center mb-4">
              <span className={`badge badge-${l.difficulty === 'beginner' ? 'teal' : l.difficulty === 'intermediate' ? 'amber' : 'red'}`}>
                {DIFFICULTY_LABELS[l.difficulty]}
              </span>
              <span className="text-sm text-muted">{l.duration} min</span>
            </div>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{l.title}</h4>
            <p className="text-sm text-muted" style={{ lineHeight: 1.55 }}>{l.description.slice(0, 90)}...</p>
          </Link>
        ))}
      </div>

      {/* Recent Results */}
      {!isAdmin && results.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3>Ultimele rezultate</h3>
            <Link to="/rezultate" className="btn btn-ghost btn-sm">Toate →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Test</th><th>Scor</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                {[...results].reverse().slice(0, 3).map((r) => (
                  <tr key={r.id}>
                    <td className="font-bold">{testMap[r.testId]?.title ?? r.testId}</td>
                    <td className="font-mono" style={{ color: r.percentage >= 60 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {r.percentage}% ({r.score}/{r.maxScore})
                    </td>
                    <td><span className={`badge badge-${r.passed ? 'green' : 'red'}`}>{r.passed ? '✓ Promovat' : '✗ Nepromovat'}</span></td>
                    <td className="text-sm text-muted">{new Date(r.completedAt).toLocaleDateString('ro-RO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
