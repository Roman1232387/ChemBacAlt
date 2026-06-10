import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResultService } from '../services/ResultService';
import { TestService } from '../services/TestService';
import { useAuth } from '../hooks/useAuth';
import type { Result } from '../models/Result';
import type { Test } from '../models/Test';

type Filter = 'all' | 'passed' | 'failed';

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const resultBreakdown = (result: Result) => {
  const correct = result.questionResults.filter((item) => item.isCorrect).length;
  const wrong = result.questionResults.filter((item) => !item.isCorrect).length;
  return { correct, wrong, total: result.questionResults.length };
};

export function MyResultsPage() {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const resultsPromise = user.role === 'admin' 
        ? ResultService.getAll() 
        : ResultService.getByUser(user.id);
      
      const [loadedResults, loadedTests] = await Promise.all([resultsPromise, TestService.getAll()]);
      setResults(loadedResults);
      setTests(loadedTests);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcarea rezultatelor.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const testMap = useMemo(() => Object.fromEntries(tests.map((test) => [test.id, test])), [tests]);

  const filtered = useMemo(() => {
    let list = [...results];
    if (filter === 'passed') list = list.filter((result) => result.passed);
    if (filter === 'failed') list = list.filter((result) => !result.passed);
    list.sort((a, b) => {
      const diff = new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime();
      return dir === 'asc' ? diff : -diff;
    });
    return list;
  }, [dir, filter, results]);

  const totalCorrect = results.reduce((sum, result) => sum + resultBreakdown(result).correct, 0);
  const totalWrong = results.reduce((sum, result) => sum + resultBreakdown(result).wrong, 0);
  const avg = results.length ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length) : 0;
  const pass = results.filter((result) => result.passed).length;

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error) {
    return (
      <div className="state-center state-error">
        <p>⚠ {error}</p>
        <button className="btn btn-secondary btn-sm" onClick={load}>Reîncearcă</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Rezultatele mele</h2>
          <p className="page-header__sub">Istoricul testelor susținute și analiza greșelilor.</p>
        </div>
        <Link to="/teste" className="btn btn-primary">Susține un test →</Link>
      </div>

      {results.length > 0 && (
        <div className="grid-stats mb-6">
          <div className="stat-card stat-card--teal"><div className="stat-card__value">{results.length}</div><div className="stat-card__label">Teste susținute</div></div>
          <div className="stat-card stat-card--green"><div className="stat-card__value">{pass}</div><div className="stat-card__label">Promovate</div></div>
          <div className="stat-card stat-card--amber"><div className="stat-card__value">{avg}%</div><div className="stat-card__label">Scor mediu</div></div>
          <div className="stat-card stat-card--green"><div className="stat-card__value">{totalCorrect}</div><div className="stat-card__label">Răspunsuri corecte</div></div>
          <div className="stat-card stat-card--red"><div className="stat-card__value">{totalWrong}</div><div className="stat-card__label">Răspunsuri greșite</div></div>
        </div>
      )}

      <div className="filter-bar">
        {(['all', 'passed', 'failed'] as Filter[]).map((item) => (
          <button key={item} className={`btn btn-sm ${filter === item ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => setFilter(item)}>
            {item === 'all' ? 'Toate' : item === 'passed' ? '✓ Promovate' : '✕ Nepromovate'}
          </button>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={() => setDir((value) => value === 'asc' ? 'desc' : 'asc')}>
          Data {dir === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="state-center">
          <div className="state-icon">◌</div>
          <p className="state-label">{results.length === 0 ? 'Nu ai susținut niciun test încă.' : 'Niciun rezultat nu corespunde filtrelor.'}</p>
          {results.length === 0 && <Link to="/teste" className="btn btn-primary btn-sm">Susține primul test</Link>}
        </div>
      ) : (
        <div className="results-history">
          {filtered.map((result) => {
            const test = testMap[result.testId];
            const breakdown = resultBreakdown(result);
            return (
              <Link key={result.id} to={`/rezultate/${result.id}`} className="card card--link result-history-card">
                <div>
                  <span className={`badge badge-${result.passed ? 'green' : 'red'}`}>{result.passed ? 'Promovat' : 'Nepromovat'}</span>
                  <h3>{test?.title ?? `Test #${result.testId}`}</h3>
                  <p className="text-sm text-muted">
                    {new Date(result.completedAt).toLocaleDateString('ro-RO')} · {formatDuration(result.duration)}
                  </p>
                </div>
                <div className="result-history-card__score">
                  <strong>{result.percentage}%</strong>
                  <span>{result.score}/{result.maxScore} puncte</span>
                  <div className="progress-bar" style={{ width: '100%', marginTop: 8, height: 4 }}>
                    <div
                      className={`progress-bar__fill progress-bar__fill--${result.passed ? 'green' : 'red'}`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                </div>
                <div className="result-history-card__breakdown">
                  <span className="text-green">✓ {breakdown.correct} corecte</span>
                  <span className="text-red">✕ {breakdown.wrong} greșite</span>
                  <span className="text-muted">{breakdown.total} total</span>
                </div>
                <span className="btn btn-secondary btn-sm">Vezi greșelile →</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
