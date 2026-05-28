import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ResultService } from '../services/ResultService';
import { TestService }   from '../services/TestService';
import { useAuth } from '../hooks/useAuth';
import type { Result } from '../models/Result';
import type { Test }   from '../models/Test';

type Filter = 'all' | 'passed' | 'failed';

export function MyResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [tests,   setTests]   = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [filter,  setFilter]  = useState<Filter>('all');
  const [dir,     setDir]     = useState<'asc' | 'desc'>('desc');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError(null);
    try {
      const [r, t] = await Promise.all([ResultService.getByUser(user.id), TestService.getAll()]);
      setResults(r); setTests(t);
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare.'); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const tMap = useMemo(() => Object.fromEntries(tests.map((t) => [t.id, t])), [tests]);

  const filtered = useMemo(() => {
    let list = [...results];
    if (filter === 'passed') list = list.filter((r) => r.passed);
    if (filter === 'failed') list = list.filter((r) => !r.passed);
    list.sort((a, b) => {
      const d = new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      return dir === 'asc' ? d : -d;
    });
    return list;
  }, [results, filter, dir]);

  const avg  = results.length ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0;
  const pass = results.filter((r) => r.passed).length;

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error)   return <div className="state-center state-error"><p>⚠ {error}</p><button className="btn btn-secondary btn-sm" onClick={load}>Reincearca</button></div>;

  return (
    <div>
      <div className="page-header">
        <div><h2>Rezultatele Mele</h2><p className="page-header__sub">Istoricul testelor sustinute</p></div>
        <Link to="/teste" className="btn btn-primary">Sustine un test →</Link>
      </div>

      {results.length > 0 && (
        <div className="grid-stats mb-6">
          <div className="stat-card"><div className="stat-card__value">{results.length}</div><div className="stat-card__label">Total teste</div></div>
          <div className="stat-card"><div className="stat-card__value" style={{ color: 'var(--green)' }}>{pass}</div><div className="stat-card__label">Promovate</div></div>
          <div className="stat-card"><div className="stat-card__value" style={{ color: 'var(--red)' }}>{results.length - pass}</div><div className="stat-card__label">Nepromovate</div></div>
          <div className="stat-card"><div className="stat-card__value" style={{ color: avg >= 60 ? 'var(--green)' : 'var(--red)' }}>{avg}%</div><div className="stat-card__label">Scor mediu</div></div>
        </div>
      )}

      <div className="filter-bar">
        {(['all', 'passed', 'failed'] as Filter[]).map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setFilter(f)}>
            {f === 'all' ? 'Toate' : f === 'passed' ? '✓ Promovate' : '✗ Nepromovate'}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setDir((d) => d === 'asc' ? 'desc' : 'asc')}>
          Data {dir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="state-center">
          <div className="state-icon">◎</div>
          <p className="state-label">{results.length === 0 ? 'Nu ai sustinut niciun test inca.' : 'Niciun rezultat corespunde filtrelor.'}</p>
          {results.length === 0 && <Link to="/teste" className="btn btn-primary btn-sm">Sustine primul test</Link>}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Test</th><th>Scor</th><th>Progres</th><th>Status</th><th>Durata</th><th>Data</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const t = tMap[r.testId];
                const mins = Math.floor(r.duration / 60);
                const secs = r.duration % 60;
                return (
                  <tr key={r.id}>
                    <td className="font-bold">{t?.title ?? r.testId}</td>
                    <td className="font-mono" style={{ color: r.percentage >= 60 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {r.percentage}%
                    </td>
                    <td style={{ width: 110 }}>
                      <div className="progress-bar">
                        <div className={`progress-bar__fill progress-bar__fill--${r.percentage >= 60 ? 'teal' : 'red'}`} style={{ width: `${r.percentage}%` }} />
                      </div>
                    </td>
                    <td><span className={`badge badge-${r.passed ? 'green' : 'red'}`}>{r.passed ? '✓ Promovat' : '✗ Nepromovat'}</span></td>
                    <td className="text-sm text-muted">{mins}m {secs}s</td>
                    <td className="text-sm text-muted">{new Date(r.completedAt).toLocaleDateString('ro-RO')}</td>
                    <td><Link to={`/rezultate/${r.id}`} className="btn btn-ghost btn-sm">Detalii →</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
