import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChapterService } from '../services/ChapterService';
import { LessonService } from '../services/LessonService';
import type { Chapter, Lesson, LessonCategory, LessonDifficulty } from '../models/Lesson';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../models/Lesson';
import { CustomSelect } from '../components/ui/CustomSelect';

export function LessonsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState<LessonDifficulty | ''>('');
  const [catFilter, setCatFilter] = useState<LessonCategory | ''>('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedLessons, loadedChapters] = await Promise.all([
        LessonService.getAll(),
        ChapterService.getAll().catch(() => []),
      ]);
      const orderedChapters = [...loadedChapters].sort((a, b) => a.order - b.order);
      setLessons(loadedLessons);
      setChapters(orderedChapters);
      setExpanded(new Set(orderedChapters.map((chapter) => chapter.id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcarea lecțiilor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const matchesSearch = !query ||
        lesson.title.toLowerCase().includes(query) ||
        lesson.description.toLowerCase().includes(query);
      const matchesDifficulty = !diffFilter || lesson.difficulty === diffFilter;
      const matchesCategory = !catFilter || lesson.category === catFilter;
      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [catFilter, diffFilter, lessons, search]);

  const grouped = useMemo(() => {
    const chapterMap = new Map(chapters.map((chapter) => [chapter.id, chapter]));
    const groups = chapters.map((chapter) => ({
      chapter,
      lessons: filtered
        .filter((lesson) => lesson.chapterId === chapter.id)
        .sort((a, b) => a.title.localeCompare(b.title)),
    }));

    const withoutChapter = filtered.filter((lesson) => !lesson.chapterId || !chapterMap.has(lesson.chapterId));
    if (withoutChapter.length > 0) {
      groups.push({
        chapter: { id: 'uncategorized', title: 'Fără capitol', profile: 'general', order: 999 },
        lessons: withoutChapter,
      });
    }

    return groups.filter((group) => group.lessons.length > 0);
  }, [chapters, filtered]);

  const toggleChapter = (chapterId: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) next.delete(chapterId);
      else next.add(chapterId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="state-center">
        <div className="spinner" />
        <p className="state-label">Se încarcă lecțiile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-center state-error">
        <p>{error}</p>
        <button className="btn btn-secondary btn-sm" onClick={load}>Reîncearcă</button>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Lecții pentru Bacalaureat</h2>
          <p className="page-header__sub">{filtered.length} din {lessons.length} lecții afișate, grupate pe capitole.</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="form-input" placeholder="Caută lecții, concepte, reacții..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ width: 180 }}>
          <CustomSelect
            placeholder="Orice nivel"
            value={diffFilter}
            onChange={(val) => setDiffFilter(val as LessonDifficulty | '')}
            options={[
              { value: '', label: 'Orice nivel' },
              { value: 'beginner', label: 'Inițiere' },
              { value: 'intermediate', label: 'Mediu' },
              { value: 'advanced', label: 'Avansat' }
            ]}
          />
        </div>
        <div style={{ width: 220 }}>
          <CustomSelect
            placeholder="Orice categorie"
            value={catFilter}
            onChange={(val) => setCatFilter(val as LessonCategory | '')}
            options={[
              { value: '', label: 'Orice categorie' },
              ...(Object.entries(CATEGORY_LABELS) as [LessonCategory, string][]).map(([key, label]) => ({ value: key, label }))
            ]}
          />
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="state-center">
          <div className="state-icon">📚</div>
          <p className="state-label">Nicio lecție nu corespunde filtrelor.</p>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDiffFilter(''); setCatFilter(''); }}>
            Resetează filtrele
          </button>
        </div>
      ) : (
        <div className="lesson-chapters">
          {grouped.map(({ chapter, lessons: chapterLessons }) => {
            const isOpen = expanded.has(chapter.id);
            return (
              <section key={chapter.id} className="chapter-panel">
                <button className="chapter-panel__header" onClick={() => toggleChapter(chapter.id)}>
                  <span>
                    <strong>{chapter.title}</strong>
                    <small>{chapterLessons.length} lecții · profil {chapter.profile}</small>
                  </span>
                  <span className="chapter-panel__toggle">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="lesson-list">
                    {chapterLessons.map((lesson) => (
                      <Link key={lesson.id} to={`/lectii/${lesson.id}`} className="lesson-row card--link">
                        <div>
                          <div className="flex gap-2 flex-wrap" style={{ marginBottom: 8 }}>
                            <span className="badge badge-neutral">{chapter.title}</span>
                            <span className={`badge badge-${lesson.difficulty === 'beginner' ? 'teal' : lesson.difficulty === 'intermediate' ? 'amber' : 'red'}`}>
                              {DIFFICULTY_LABELS[lesson.difficulty]}
                            </span>
                          </div>
                          <h3>{lesson.title}</h3>
                          <p className="text-sm text-muted" style={{ 
                            marginTop: 6,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.5
                          }}>{lesson.description}</p>
                        </div>
                        <div className="lesson-row__meta">
                          <span>{lesson.sections.length} secțiuni</span>
                          <span>{lesson.duration} min</span>
                          <span className="badge badge-neutral">material de învățare</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
