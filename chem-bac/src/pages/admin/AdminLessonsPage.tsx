import React, { useCallback, useEffect, useMemo, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ChapterService } from '../../services/ChapterService';
import { LessonService } from '../../services/LessonService';
import type { Chapter, Lesson, LessonCategory, LessonDifficulty, LessonFormData, LessonSectionType } from '../../models/Lesson';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../../models/Lesson';
import { CustomSelect } from '../../components/ui/CustomSelect';

interface LessonErrors {
  title?: string;
  description?: string;
  duration?: string;
  sections?: string;
}

const SECTION_TYPE_LABELS: Record<LessonSectionType, string> = {
  text: 'Text',
  formula: 'Formulă',
  table: 'Tabel',
  image: 'Imagine',
  tip: 'Tip BAC',
  bac_attention: 'Atenție BAC',
  warning: 'Avertizare',
};

const newSection = (type: LessonSectionType = 'text') => ({
  id: `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: '',
  content: '',
  formula: '',
  type,
  imageUrl: '',
  tableJson: '',
});

const emptyForm = (): LessonFormData => ({
  chapterId: null,
  title: '',
  category: 'chimie-anorganica',
  difficulty: 'beginner',
  description: '',
  duration: 15,
  sections: [newSection()],
});

function validateLesson(data: LessonFormData): LessonErrors {
  const errors: LessonErrors = {};
  if (data.title.trim().length < 5) errors.title = 'Titlul trebuie să aibă minim 5 caractere.';
  if (data.description.trim().length < 10) errors.description = 'Descrierea trebuie să aibă minim 10 caractere.';
  if (data.duration < 5 || data.duration > 15) errors.duration = 'Durata trebuie să fie între 5 și 15 minute.';
  if (data.sections.length === 0) errors.sections = 'Adăugați cel puțin o secțiune.';
  else {
    const invalidIndex = data.sections.findIndex((section) => {
      const hasMainContent = section.type === 'formula'
        ? Boolean(section.formula.trim() || section.content.trim())
        : Boolean(section.content.trim());
      return !section.title.trim() || !hasMainContent;
    });
    if (invalidIndex >= 0) errors.sections = `Secțiunea ${invalidIndex + 1} trebuie să aibă titlu și conținut.`;
  }
  return errors;
}

function renderFormulaPreview(formula: string) {
  if (!formula.trim()) return null;
  try {
    return <div className="formula-block" dangerouslySetInnerHTML={{ __html: katex.renderToString(formula, { throwOnError: false }) }} />;
  } catch {
    return <div className="alert alert-error">Formula nu poate fi randată.</div>;
  }
}

interface LessonModalProps {
  chapters: Chapter[];
  editLesson: Lesson | null;
  onSave: (data: LessonFormData) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function LessonModal({ chapters, editLesson, onSave, onClose, isSaving }: LessonModalProps) {
  const [newSectionType, setNewSectionType] = useState<LessonSectionType>('text');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<LessonFormData>(
    editLesson
      ? {
          chapterId: editLesson.chapterId ?? null,
          title: editLesson.title,
          category: editLesson.category,
          difficulty: editLesson.difficulty,
          description: editLesson.description,
          duration: editLesson.duration,
          sections: editLesson.sections.length ? editLesson.sections : [newSection()],
        }
      : emptyForm()
  );
  const [errors, setErrors] = useState<LessonErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const updateForm = (next: LessonFormData) => {
    setForm(next);
    setErrors(validateLesson(next));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const next = {
      ...form,
      [name]: name === 'duration' ? Number(value) : value,
    } as LessonFormData;
    updateForm(next);
  };

  const updateSection = (id: string, patch: Partial<LessonFormData['sections'][number]>) => {
    updateForm({
      ...form,
      sections: form.sections.map((section) => section.id === id ? { ...section, ...patch } : section),
    });
  };

  const removeSection = (id: string) => {
    if (form.sections.length <= 1) return;
    updateForm({ ...form, sections: form.sections.filter((section) => section.id !== id) });
  };

  const fe = (field: keyof LessonErrors) => touched[field] ? errors[field] : undefined;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ title: true, description: true, duration: true, sections: true });
    const validation = validateLesson(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    await onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal__header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--teal)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Management Conținut
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: 4 }}>
              {editLesson ? 'Editează lecția' : 'Creează o lecție nouă'}
            </h3>
          </div>
          <button className="modal__close" onClick={onClose} title="Închide">✕</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="admin-form-container">
          <div className="modal__body">
            <div className="admin-form-grid">
              <div className="admin-form-box">
                <div className="admin-form-box__title">Date Generale</div>
                <div className="flex-col gap-3">
                  <div className="form-group">
                    <label className="form-label">Titlu Lecție *</label>
                    <input
                      name="title"
                      className={`form-input${fe('title') ? ' is-error' : ''}`}
                      value={form.title}
                      onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                      onChange={handleChange}
                      placeholder="Ex: Reacții de oxido-reducere"
                    />
                    {fe('title') && <span className="form-error">{fe('title')}</span>}
                  </div>

                  <div className="form-group">
                    <CustomSelect
                      label="Capitol Asociat"
                      placeholder="Alege un capitol..."
                      value={form.chapterId || ''}
                      onChange={(val) => updateForm({ ...form, chapterId: val || null })}
                      options={[
                        { value: '', label: '-- Fără capitol (Independent) --' },
                        ...chapters.map((chapter) => ({ value: chapter.id, label: chapter.title }))
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-box">
                <div className="admin-form-box__title">Metadate și Dificultate</div>
                <div className="grid-form-2">
                  <div className="form-group">
                    <CustomSelect
                      label="Categorie"
                      value={form.category}
                      onChange={(val) => updateForm({ ...form, category: val as LessonCategory })}
                      options={Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ value: key, label }))}
                    />
                  </div>
                  <div className="form-group">
                    <CustomSelect
                      label="Dificultate"
                      value={form.difficulty}
                      onChange={(val) => updateForm({ ...form, difficulty: val as LessonDifficulty })}
                      options={Object.entries(DIFFICULTY_LABELS).map(([key, label]) => ({ value: key, label }))}
                    />
                  </div>
                </div>
                <div className="form-group mt-4">
                  <label className="form-label">Durata estimată (minute) *</label>
                  <input
                    name="duration"
                    type="number"
                    min={5}
                    max={15}
                    className={`form-input${fe('duration') ? ' is-error' : ''}`}
                    value={form.duration}
                    onBlur={() => setTouched((prev) => ({ ...prev, duration: true }))}
                    onChange={handleChange}
                  />
                  {fe('duration') && <span className="form-error">{fe('duration')}</span>}
                </div>
              </div>
            </div>

            <div className="admin-form-box">
              <div className="admin-form-box__title">Descriere Scurtă</div>
              <textarea
                name="description"
                className={`form-input${fe('description') ? ' is-error' : ''}`}
                value={form.description}
                onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                onChange={handleChange}
                rows={2}
                placeholder="O scurtă prezentare a ceea ce va învăța elevul în această lecție..."
              />
              {fe('description') && <span className="form-error">{fe('description')}</span>}
            </div>

            <div className="admin-form-box" style={{ background: 'rgba(0, 212, 170, 0.03)' }}>
              <div className="admin-form-box__title">Structură și Conținut</div>
              
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted">Gestionează secțiunile lecției (text, formule, imagini, etc.)</p>
                <div className="flex gap-2">
                  <div style={{ width: 160 }}>
                    <CustomSelect
                      value={newSectionType}
                      onChange={(val) => setNewSectionType(val as LessonSectionType)}
                      options={Object.entries(SECTION_TYPE_LABELS).map(([key, label]) => ({ value: key, label }))}
                    />
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateForm({ ...form, sections: [...form.sections, newSection(newSectionType)] })}>
                    + Adaugă secțiune
                  </button>
                </div>
              </div>

              {fe('sections') && <div className="alert alert-error mb-4">{fe('sections')}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {form.sections.map((section, index) => (
                  <div key={section.id} className="admin-accordion">
                    <div 
                      className="admin-accordion__header"
                      onClick={() => setExpandedSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))}
                    >
                      <div className="admin-accordion__title">
                        <span className="badge badge-teal" style={{ width: 24, height: 24, borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                          {index + 1}
                        </span>
                        <span>{section.title || `Secțiunea ${index + 1}: ${SECTION_TYPE_LABELS[section.type]}`}</span>
                        <span className="text-xs text-muted" style={{ fontWeight: 400 }}>({SECTION_TYPE_LABELS[section.type]})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="text-red hover:opacity-80"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                          onClick={(e) => { e.stopPropagation(); updateForm({ ...form, sections: form.sections.filter((s) => s.id !== section.id) }); }}
                        >
                          Elimină
                        </button>
                        <span style={{ transform: expandedSections[section.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {(expandedSections[section.id] || index === form.sections.length - 1) && (
                      <div className="admin-accordion__content">
                        <div className="grid-form-2 mb-4">
                          <div className="form-group">
                            <label className="form-label text-xs uppercase letter-spacing-wide">Titlu Secțiune</label>
                            <input
                              className="form-input"
                              value={section.title}
                              onChange={(e) => updateSection(section.id, { title: e.target.value })}
                              placeholder="Titlul afișat în TOC"
                            />
                          </div>
                          <div className="form-group" style={{ flex: 1 }}>
                            <CustomSelect
                              label="Tip Conținut"
                              value={section.type}
                              onChange={(val) => updateSection(section.id, { type: val as LessonSectionType })}
                              options={Object.entries(SECTION_TYPE_LABELS).map(([key, label]) => ({ value: key, label }))}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label text-xs uppercase letter-spacing-wide">Conținut</label>
                          <textarea
                            className="form-input"
                            rows={section.type === 'formula' ? 2 : 4}
                            value={section.content}
                            onChange={(e) => updateSection(section.id, { content: e.target.value })}
                            placeholder={section.type === 'formula' ? 'Explicație succintă...' : 'Introdu conținutul secțiunii aici...'}
                          />
                        </div>

                        {section.type === 'formula' && (
                          <div className="form-group mt-3">
                            <label className="form-label text-xs uppercase letter-spacing-wide">Cod KaTeX</label>
                            <input
                              className="form-input font-mono"
                              value={section.formula}
                              onChange={(e) => updateSection(section.id, { formula: e.target.value })}
                              placeholder="Ex: E = mc^2"
                            />
                            {renderFormulaPreview(section.formula)}
                          </div>
                        )}

                        {section.type === 'table' && (
                          <div className="form-group mt-3">
                            <label className="form-label text-xs uppercase letter-spacing-wide">Structură Tabel (JSON)</label>
                            <textarea
                              className="form-input font-mono text-xs"
                              rows={3}
                              value={section.tableJson ?? ''}
                              onChange={(e) => updateSection(section.id, { tableJson: e.target.value })}
                              placeholder='[["Cap1","Cap2"],["Val1","Val2"]]'
                            />
                          </div>
                        )}

                        {section.type === 'image' && (
                          <div className="form-group mt-3">
                            <label className="form-label text-xs uppercase letter-spacing-wide">Link Imagine (URL)</label>
                            <input
                              className="form-input"
                              value={section.imageUrl ?? ''}
                              onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })}
                              placeholder="https://exemplu.ro/imagine.png"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Anulare</button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Salvare...' : editLesson ? 'Actualizează' : 'Creează lecție'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminLessonsPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [loadedLessons, loadedChapters] = await Promise.all([
        LessonService.getAll(),
        ChapterService.getAll().catch(() => []),
      ]);
      setLessons(loadedLessons);
      setChapters(loadedChapters);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la încărcare.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const chapterById = useMemo(() => new Map(chapters.map((chapter) => [chapter.id, chapter])), [chapters]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return lessons;
    return lessons.filter((lesson) =>
      lesson.title.toLowerCase().includes(query) ||
      lesson.description.toLowerCase().includes(query)
    );
  }, [lessons, search]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (data: LessonFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (editLesson) {
        const updated = await LessonService.update(editLesson.id, data);
        setLessons((prev) => prev.map((lesson) => lesson.id === updated.id ? updated : lesson));
        showToast('Lecția a fost actualizată.');
      } else {
        const created = await LessonService.create(data);
        setLessons((prev) => [...prev, created]);
        showToast('Lecția a fost creată.');
      }
      setShowForm(false);
      setEditLesson(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la salvare.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError(null);
    try {
      await LessonService.delete(deleteTarget.id);
      setLessons((prev) => prev.filter((lesson) => lesson.id !== deleteTarget.id));
      showToast('Lecția a fost ștearsă.');
      setDeleteTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la ștergere.');
    }
  };

  if (loading) return <div className="state-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="alert alert-success">{toast}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-header">
        <div>
          <h2>Administrare lecții</h2>
          <p className="page-header__sub">{filtered.length} din {lessons.length} lecții</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditLesson(null); setShowForm(true); }}>+ Lecție nouă</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="form-input" placeholder="Caută lecții..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="state-center">
          <p className="state-label">Nu există lecții pentru criteriile curente.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Capitol</th>
                <th>Categorie</th>
                <th>Nivel</th>
                <th>Secțiuni</th>
                <th>Durata</th>
                <th>Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="font-bold">{lesson.title}</td>
                  <td>{lesson.chapterId ? chapterById.get(lesson.chapterId)?.title ?? 'Capitol necunoscut' : '-'}</td>
                  <td>{CATEGORY_LABELS[lesson.category]}</td>
                  <td><span className="badge badge-neutral">{DIFFICULTY_LABELS[lesson.difficulty]}</span></td>
                  <td className="font-mono text-center">{lesson.sections.length}</td>
                  <td>{lesson.duration} min</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditLesson(lesson); setShowForm(true); }}>Editează</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(lesson)}>Șterge</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <LessonModal chapters={chapters} editLesson={editLesson} onSave={handleSave} onClose={() => { setShowForm(false); setEditLesson(null); }} isSaving={isSaving} />
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal__header">
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}>Confirmare ștergere</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(null)}>x</button>
            </div>
            <p className="text-muted">Ștergi lecția:</p>
            <p className="font-bold" style={{ marginTop: 12 }}>{deleteTarget.title}</p>
            <div className="modal__footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Anulare</button>
              <button className="btn btn-danger" onClick={handleDelete}>Șterge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
