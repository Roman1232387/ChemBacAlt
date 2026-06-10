import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LessonService } from '../services/LessonService';
import { TestService } from '../services/TestService';
import { ResultService } from '../services/ResultService';
import { HealthService } from '../services/HealthService';
import { FileService } from '../services/FileService';
import type { Lesson } from '../models/Lesson';
import type { Test } from '../models/Test';
import type { Result } from '../models/Result';
import { DIFFICULTY_LABELS } from '../models/Lesson';

export function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [resourceCount, setResourceCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState<string>('Verificare...');

  useEffect(() => {
    HealthService.check()
      .then((message) => setBackendStatus(message))
      .catch(() => setBackendStatus('Backend indisponibil'));
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [loadedLessons, loadedTests, files] = await Promise.all([
          LessonService.getAll(),
          TestService.getAll(),
          FileService.getAll().catch(() => []),
        ]);
        setLessons(loadedLessons);
        setTests(loadedTests.filter((test) => test.status === 'published'));
        setResourceCount(files.length);
        if (user) setResults(await ResultService.getByUser(user.id));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const testMap = useMemo(() => Object.fromEntries(tests.map((test) => [test.id, test])), [tests]);
  const avgScore = results.length ? Math.round(results.reduce((sum, result) => sum + result.percentage, 0) / results.length) : 0;
  const passCount = results.filter((result) => result.passed).length;

  if (loading) return <div className="state-center"><div className="spinner" /></div>;

  return (
    <div>
      <div className="welcome-banner">
        <div>
          <div className="welcome-banner__title">Bună, {user?.name.split(' ')[0]}!</div>
          <p className="text-muted">
            {isAdmin
              ? 'Gestionează lecțiile, testele și resursele pentru elevi.'
              : 'Continuă pregătirea pentru Bacalaureatul la Chimie din Republica Moldova.'}
          </p>
        </div>
        {isAdmin
          ? <Link to="/admin/teste" className="btn btn-primary btn-lg">Administrează teste →</Link>
          : <Link to="/teste" className="btn btn-primary btn-lg">Susține un test →</Link>}
      </div>

      <div className="grid-stats mb-6">
        <div className="stat-card stat-card--teal"><div className="stat-card__icon">📚</div><div className="stat-card__value">{lessons.length}</div><div className="stat-card__label">Lecții disponibile</div></div>
        <div className="stat-card stat-card--amber"><div className="stat-card__icon">📝</div><div className="stat-card__value">{tests.length}</div><div className="stat-card__label">Teste publicate</div></div>
        <div className="stat-card stat-card--blue"><div className="stat-card__icon">📥</div><div className="stat-card__value">{resourceCount}</div><div className="stat-card__label">Resurse disponibile</div></div>
        {!isAdmin && (
          <>
            <Link to="/rezultate" className="stat-card stat-card--green card--link" style={{ textDecoration: 'none' }}>
              <div className="stat-card__icon">✅</div><div className="stat-card__value">{results.length}</div><div className="stat-card__label">Teste susținute</div>
            </Link>
            {results.length > 0 ? (
              <>
                <div className="stat-card stat-card--red"><div className="stat-card__icon">🎯</div><div className="stat-card__value" style={{ color: avgScore >= 60 ? 'var(--green)' : 'var(--red)' }}>{avgScore}%</div><div className="stat-card__label">Scor mediu</div></div>
                <div className="stat-card stat-card--green"><div className="stat-card__icon">🏁</div><div className="stat-card__value" style={{ color: 'var(--green)' }}>{passCount}</div><div className="stat-card__label">Promovate</div></div>
              </>
            ) : (
              <div className="stat-card stat-card--amber"><div className="stat-card__icon">ℹ</div><div className="stat-card__value">-</div><div className="stat-card__label">Statisticile apar după primul test</div></div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3>Explorează lecțiile</h3>
        <Link to="/lectii" className="btn btn-ghost btn-sm">Vezi toate →</Link>
      </div>
      <div className="grid-2 mb-8">
        {lessons.slice(0, 4).map((lesson) => (
          <Link key={lesson.id} to={`/lectii/${lesson.id}`} className="card card--link" style={{ textDecoration: 'none', display: 'block' }}>
            <div className="flex justify-between items-center mb-4">
              <span className={`badge badge-${lesson.difficulty === 'beginner' ? 'teal' : lesson.difficulty === 'intermediate' ? 'amber' : 'red'}`}>
                {DIFFICULTY_LABELS[lesson.difficulty]}
              </span>
              <span className="text-sm text-muted">{lesson.duration} min</span>
            </div>
            <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{lesson.title}</h4>
            <p className="text-sm text-muted" style={{ 
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>{lesson.description}</p>
          </Link>
        ))}
      </div>

      {!isAdmin && results.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3>Ultimele rezultate</h3>
            <Link to="/rezultate" className="btn btn-ghost btn-sm">Analiză completă →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Test</th><th>Scor</th><th>Status</th><th>Data</th><th></th></tr></thead>
              <tbody>
                {[...results].reverse().slice(0, 3).map((result) => (
                  <tr key={result.id}>
                    <td className="font-bold">{testMap[result.testId]?.title ?? result.testId}</td>
                    <td className="font-mono" style={{ color: result.percentage >= 60 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {result.percentage}% ({result.score}/{result.maxScore})
                    </td>
                    <td><span className={`badge badge-${result.passed ? 'green' : 'red'}`}>{result.passed ? '✓ Promovat' : '✕ Nepromovat'}</span></td>
                    <td className="text-sm text-muted">{new Date(result.completedAt).toLocaleDateString('ro-RO')}</td>
                    <td><Link to={`/rezultate/${result.id}`} className="btn btn-ghost btn-sm">Detalii →</Link></td>
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
