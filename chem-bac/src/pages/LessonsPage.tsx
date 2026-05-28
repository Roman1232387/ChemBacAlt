import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LessonService } from '../services/LessonService';
import type { Lesson, LessonDifficulty, LessonCategory } from '../models/Lesson';
import { DIFFICULTY_LABELS, CATEGORY_LABELS } from '../models/Lesson';

type SortKey = 'title' | 'duration' | 'difficulty';
const DIFF_ORDER: Record<LessonDifficulty, number> = { beginner: 1, intermediate: 2, advanced: 3 };

export function LessonsPage() {
  const [lessons,  setLessons]  = useState<Lesson[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [search,   setSearch]   = useState('');
  const [diffFilt, setDiffFilt] = useState<LessonDifficulty | ''>('');
  const [catFilt,  setCatFilt]  = useState<LessonCategory | ''>('');
  const [sortKey,  setSortKey]  = useState<SortKey>('title');
  const [sortDir,  setSortDir]  = useState<'asc' | 'desc'>('asc');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setLessons(await LessonService.getAll()); }
    catch (e) { setError(e instanceof Error ? e.message : 'Eroare.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    let list = [...lessons];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((l) => l.title.toLowerCase().includes(q) || l.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (diffFilt) list = list.filter((l) => l.difficulty === diffFilt);
    if (catFilt)  list = list.filter((l) => l.category === catFilt);
    list.sort((a, b) => {
      const cmp = sortKey === 'title' ? a.title.localeCompare(b.title)
                : sortKey === 'duration' ? a.duration - b.duration
                : DIFF_ORDER[a.difficulty] - DIFF_ORDER[b.difficulty];
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [lessons, search, diffFilt, catFilt, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  if (loading) return <div className="state-center"><div className="spinner" /><p className="state-label">Se incarca lectiile...</p></div>;
  if (error)   return <div className="state-center state-error"><p>⚠ {error}</p><button className="btn btn-secondary btn-sm" onClick={load}>Reincearca</button></div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Lectii de Chimie</h2>
          <p className="page-header__sub">{filtered.length} din {lessons.length} lectii afisate</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="form-input" placeholder="Cauta lectii..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: 'auto', minWidth: 160 }} value={diffFilt} onChange={(e) => setDiffFilt(e.target.value as LessonDifficulty | '')}>
          <option value="">Orice dificultate</option>
          <option value="beginner">Initiere</option>
          <option value="intermediate">Mediu</option>
          <option value="advanced">Avansat</option>
        </select>
        <select className="form-input" style={{ width: 'auto', minWidth: 180 }} value={catFilt} onChange={(e) => setCatFilt(e.target.value as LessonCategory | '')}>
          <option value="">Orice categorie</option>
          {(Object.entries(CATEGORY_LABELS) as [LessonCategory, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <div className="flex gap-2">
          {(['title', 'duration', 'difficulty'] as SortKey[]).map((k) => (
            <button key={k} className={`btn btn-sm ${sortKey === k ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => toggleSort(k)}>
              {k === 'title' ? 'Titlu' : k === 'duration' ? 'Durata' : 'Nivel'}
              {sortKey === k && (sortDir === 'asc' ? ' ↑' : ' ↓')}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="state-center">
          <div className="state-icon">◈</div>
          <p className="state-label">Nicio lectie nu corespunde filtrelor.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDiffFilt(''); setCatFilt(''); }}>
            Reseteaza filtrele
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid-2">
        {filtered.map((l) => (
          <Link key={l.id} to={`/lectii/${l.id}`} className="card card--link" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="flex justify-between items-center">
              <span className={`badge badge-${l.difficulty === 'beginner' ? 'teal' : l.difficulty === 'intermediate' ? 'amber' : 'red'}`}>
                {DIFFICULTY_LABELS[l.difficulty]}
              </span>
              <span className="text-sm text-muted">{l.duration} min</span>
            </div>
            <h4 style={{ fontFamily: 'var(--font-display)' }}>{l.title}</h4>
            <p className="text-sm text-muted" style={{ lineHeight: 1.55 }}>{l.description.slice(0, 100)}...</p>
            <div className="flex gap-2 flex-wrap" style={{ marginTop: 4 }}>
              <span className="badge badge-neutral">{CATEGORY_LABELS[l.category]}</span>
              {l.tags.slice(0, 2).map((t) => <span key={t} className="badge badge-neutral">{t}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
