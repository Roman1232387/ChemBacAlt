import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LessonService } from '../services/LessonService';
import { TestService } from '../services/TestService';
import type { Lesson } from '../models/Lesson';
import type { Test } from '../models/Test';
import { DIFFICULTY_LABELS, CATEGORY_LABELS } from '../models/Lesson';

export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson,  setLesson]  = useState<Lesson | null>(null);
  const [tests,   setTests]   = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [l, all] = await Promise.all([LessonService.getById(id), TestService.getAll()]);
        setLesson(l);
        setTests(all.filter((t) => t.lessonId === id && t.status === 'published'));
      } catch (e) { setError(e instanceof Error ? e.message : 'Eroare.'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error)   return <div className="state-center state-error"><p>⚠ {error}</p><button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>Inapoi</button></div>;
  if (!lesson) return null;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Link to="/lectii" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', marginBottom: 24 }}>← Inapoi la lectii</Link>

      {/* Hero */}
      <div className="card" style={{ background: 'linear-gradient(135deg,var(--bg-surface),rgba(0,212,170,0.04))', marginBottom: 20 }}>
        <div className="flex gap-3 items-center flex-wrap mb-4">
          <span className={`badge badge-${lesson.difficulty === 'beginner' ? 'teal' : lesson.difficulty === 'intermediate' ? 'amber' : 'red'}`}>
            {DIFFICULTY_LABELS[lesson.difficulty]}
          </span>
          <span className="badge badge-neutral">{lesson.duration} min</span>
          <span className="badge badge-neutral">{lesson.sections.length} sectiuni</span>
          <span className="badge badge-neutral">{CATEGORY_LABELS[lesson.category]}</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 10 }}>{lesson.title}</h2>
        <p className="text-muted">{lesson.description}</p>
        <div className="flex gap-2 flex-wrap mt-4">
          {lesson.tags.map((t) => <span key={t} className="badge badge-neutral">{t}</span>)}
        </div>
      </div>

      {/* Sections */}
      {lesson.sections.length === 0 ? (
        <div className="card" style={{ marginBottom: 14 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Continut indisponibil</h3>
          <p className="text-muted">Aceasta lectie nu are sectiuni adaugate inca.</p>
        </div>
      ) : (
        lesson.sections.map((sec, i) => (
          <div key={sec.id} className="card" style={{ marginBottom: 14 }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--teal-dim)', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                {i + 1}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)' }}>{sec.title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75 }}>{sec.content}</p>
            {sec.formula && <div className="formula-block">{sec.formula}</div>}
          </div>
        ))
      )}

      {/* Related tests */}
      {tests.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Teste disponibile pentru aceasta lectie</h3>
          {tests.map((t) => (
            <div key={t.id} className="card flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 12 }}>
              <div>
                <div className="font-bold" style={{ marginBottom: 4 }}>{t.title}</div>
                <div className="text-sm text-muted">{t.questions.length} intrebari &middot; {t.duration} min &middot; Promovare: {t.passingScore}%</div>
              </div>
              <Link to={`/teste/${t.id}`} className="btn btn-primary btn-sm">Sustine testul →</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
