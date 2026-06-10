import React, { useEffect, useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LessonService } from '../services/LessonService';
import { TestService } from '../services/TestService';
import type { Lesson, LessonSection } from '../models/Lesson';
import type { Test } from '../models/Test';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../models/Lesson';

const sectionAnchor = (section: LessonSection, index: number) => `sectiune-${section.id || index}`;

function renderFormula(formula: string) {
  if (!formula.trim()) return null;
  return (
    <div
      className="formula-block formula-block--terminal"
      dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }}
    />
  );
}

function renderTable(tableJson?: string | null) {
  if (!tableJson?.trim()) return null;

  try {
    const rows = JSON.parse(tableJson);
    if (!Array.isArray(rows)) return <div className="alert alert-error">Tabel invalid.</div>;

    return (
      <div className="table-wrap" style={{ marginTop: 14 }}>
        <table>
          <tbody>
            {rows.map((row: unknown, rowIndex: number) => (
              <tr key={rowIndex}>
                {(Array.isArray(row) ? row : [row]).map((cell, cellIndex) => (
                  rowIndex === 0
                    ? <th key={cellIndex}>{String(cell)}</th>
                    : <td key={cellIndex}>{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  } catch {
    return <div className="alert alert-error">Tabelul nu poate fi citit.</div>;
  }
}

function SectionContent({ section }: { section: LessonSection }) {
  if (section.type === 'formula') {
    return (
      <>
        {section.content && <p className="lesson-text">{section.content}</p>}
        {renderFormula(section.formula || section.content)}
      </>
    );
  }

  if (section.type === 'bac_attention') {
    return (
      <div className="lesson-callout lesson-callout--bac">
        <strong>⚠️ Atenție la BAC!</strong>
        <p>{section.content}</p>
      </div>
    );
  }

  if (section.type === 'tip') {
    return (
      <div className="lesson-callout lesson-callout--tip">
        <strong>💡 Știați că?</strong>
        <p>{section.content}</p>
      </div>
    );
  }

  if (section.type === 'table') {
    return (
      <>
        {section.content && <p className="lesson-text">{section.content}</p>}
        {renderTable(section.tableJson)}
      </>
    );
  }

  if (section.type === 'image') {
    return (
      <>
        {section.content && <p className="lesson-text">{section.content}</p>}
        {section.imageUrl && (
          <img
            src={section.imageUrl}
            alt={section.title}
            style={{ width: '100%', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', marginTop: 14 }}
          />
        )}
      </>
    );
  }

  return <p className="lesson-text">{section.content}</p>;
}

export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [loadedLesson, loadedLessons, allTests] = await Promise.all([
          LessonService.getById(id),
          LessonService.getAll(),
          TestService.getAll(),
        ]);
        setLesson(loadedLesson);
        setAllLessons(loadedLessons);
        setTests(allTests.filter((test) => test.lessonId === id && test.status === 'published'));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Eroare.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const sortedSections = useMemo(() => {
    return [...(lesson?.sections ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [lesson]);

  const nextLesson = useMemo(() => {
    if (!lesson) return null;
    const ordered = [...allLessons].sort((a, b) => {
      const chapterCompare = String(a.chapterId ?? '').localeCompare(String(b.chapterId ?? ''));
      return chapterCompare || a.title.localeCompare(b.title);
    });
    const currentIndex = ordered.findIndex((item) => item.id === lesson.id);
    return currentIndex >= 0 ? ordered[currentIndex + 1] ?? null : null;
  }, [allLessons, lesson]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error) return <div className="state-center state-error"><p>{error}</p><button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>Înapoi</button></div>;
  if (!lesson) return null;

  return (
    <div className="lesson-layout">
      <main>
        <div className="flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 24 }}>
          <Link to="/lectii" className="btn btn-ghost btn-sm">← Înapoi la Lecții</Link>
          {nextLesson && <Link to={`/lectii/${nextLesson.id}`} className="btn btn-secondary btn-sm">Lecția următoare →</Link>}
        </div>

        <div className="card lesson-hero" style={{ marginBottom: 20 }}>
          <div className="flex gap-3 items-center flex-wrap mb-4">
            <span className={`badge badge-${lesson.difficulty === 'beginner' ? 'teal' : lesson.difficulty === 'intermediate' ? 'amber' : 'red'}`}>
              {DIFFICULTY_LABELS[lesson.difficulty]}
            </span>
            <span className="badge badge-neutral">{lesson.duration} min</span>
            <span className="badge badge-neutral">{lesson.sections.length} secțiuni</span>
            <span className="badge badge-neutral">{CATEGORY_LABELS[lesson.category]}</span>
          </div>
          <h2>{lesson.title}</h2>
          <p className="text-muted">{lesson.description}</p>
        </div>

        {sortedSections.length === 0 ? (
          <div className="card">
            <h3>Conținut indisponibil</h3>
            <p className="text-muted">Această lecție nu are secțiuni adăugate încă.</p>
          </div>
        ) : (
          sortedSections.map((section, index) => (
            <section key={section.id} id={sectionAnchor(section, index)} className="card lesson-section">
              <div className="flex items-center gap-3 mb-4">
                <div className="lesson-section__number">{index + 1}</div>
                <h3>{section.title}</h3>
              </div>
              <SectionContent section={section} />
            </section>
          ))
        )}

        {tests.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Teste disponibile pentru această lecție</h3>
            {tests.map((test) => (
              <div key={test.id} className="card flex justify-between items-center flex-wrap gap-3" style={{ marginBottom: 12 }}>
                <div>
                  <div className="font-bold" style={{ marginBottom: 4 }}>{test.title}</div>
                  <div className="text-sm text-muted">{test.questions.length} întrebări &middot; {test.duration} min &middot; Promovare: {test.passingScore}%</div>
                </div>
                <Link to={`/teste/${test.id}`} className="btn btn-primary btn-sm">Susține testul</Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <aside className="lesson-sidebar">
        <div className="toc-card">
          <h4>Cuprins Lecție</h4>
          <nav className="toc-nav">
            {sortedSections.map((section, index) => (
              <a 
                key={section.id} 
                href={`#${sectionAnchor(section, index)}`}
                className="toc-link"
              >
                {index + 1}. {section.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="card" style={{ marginTop: 24, padding: 20, background: 'var(--teal-dim)', borderColor: 'var(--teal)' }}>
          <h4 style={{ color: 'var(--teal)', marginBottom: 8 }}>💡 Sfat de învățare</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Parcurge fiecare secțiune cu atenție și încearcă să rezolvi testul asociat pentru a-ți fixa cunoștințele.
          </p>
        </div>
      </aside>
    </div>
  );
}
