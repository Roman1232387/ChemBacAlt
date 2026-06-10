import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { TestService }   from '../services/TestService';
import { LessonService } from '../services/LessonService';
import type { Test } from '../models/Test';
import type { Lesson } from '../models/Lesson';

type Sort = 'title' | 'duration' | 'passingScore';

export function TestsPage() {
  const [tests,   setTests]   = useState<Test[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState('');
  const [sort,    setSort]    = useState<Sort>('title');
  const [dir,     setDir]     = useState<'asc' | 'desc'>('asc');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [t, l] = await Promise.all([TestService.getAll(), LessonService.getAll()]);
      setTests(t.filter((tt) => tt.status === 'published'));
      setLessons(l);
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const lMap = useMemo(() => Object.fromEntries(lessons.map((l) => [l.id, l])), [lessons]);

  const filtered = useMemo(() => {
    let list = [...tests];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const cmp = sort === 'title' ? a.title.localeCompare(b.title)
                : sort === 'duration' ? a.duration - b.duration
                : a.passingScore - b.passingScore;
      return dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [tests, search, sort, dir]);

  const toggleSort = (k: Sort) => {
    if (sort === k) setDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSort(k); setDir('asc'); }
  };

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error)   return <div className="state-center state-error"><p>⚠ {error}</p><button className="btn btn-secondary btn-sm" onClick={load}>Reincearca</button></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Teste disponibile</h2>
          <p className="page-header__sub">{filtered.length} din {tests.length} teste</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="form-input" placeholder="Caută teste..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        {(['title', 'duration', 'passingScore'] as Sort[]).map((k) => (
          <button key={k} className={`btn btn-sm ${sort === k ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => toggleSort(k)}>
            {k === 'title' ? 'Titlu' : k === 'duration' ? 'Durată' : 'Promovare'}
            {sort === k && (dir === 'asc' ? ' ↑' : ' ↓')}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="state-center">
          <div className="state-icon">◉</div>
          <p className="state-label">Niciun test gasit.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')}>Reseteaza</button>
        </div>
      )}

      <div className="grid-2">
        {filtered.map((t) => {
          const lesson = lMap[t.lessonId];
          return (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="flex justify-between items-center">
                <span className="badge badge-teal">◉ Test</span>
                <span className="text-sm text-muted">{t.duration} min</span>
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)' }}>{t.title}</h4>
              <p className="text-sm text-muted">{t.description}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="badge badge-neutral">{t.questions.length} întrebări</span>
                <span className="badge badge-amber">Promovare: {t.passingScore}%</span>
                {lesson && <span className="badge badge-neutral">{lesson.title.slice(0, 22)}…</span>}
              </div>
              <Link to={`/teste/${t.id}`} className="btn btn-primary btn-full" style={{ marginTop: 'auto' }}>
                Susține testul →
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
