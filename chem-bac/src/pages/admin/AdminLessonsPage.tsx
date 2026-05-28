import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LessonService } from '../../services/LessonService';
import type { Lesson, LessonCategory, LessonDifficulty, LessonFormData } from '../../models/Lesson';
import { CATEGORY_LABELS, DIFFICULTY_LABELS } from '../../models/Lesson';

interface LessonErrors {
  title?: string;
  description?: string;
  duration?: string;
  sections?: string;
}

const newSection = () => ({
  id: `tmp-${Date.now()}`,
  title: '',
  content: '',
  formula: '',
});

const emptyForm = (): LessonFormData => ({
  title: '',
  category: 'chimie-anorganica',
  difficulty: 'beginner',
  description: '',
  duration: 30,
  sections: [newSection()],
});

function validateLesson(data: LessonFormData): LessonErrors {
  const errors: LessonErrors = {};
  if (data.title.trim().length < 5) errors.title = 'Titlul trebuie sa aiba minim 5 caractere.';
  if (data.description.trim().length < 10) errors.description = 'Descrierea trebuie sa aiba minim 10 caractere.';
  if (data.duration < 5 || data.duration > 240) errors.duration = 'Durata trebuie sa fie intre 5 si 240 de minute.';
  if (data.sections.length === 0) errors.sections = 'Adaugati cel putin o sectiune.';
  else {
    const invalidIndex = data.sections.findIndex((section) => !section.title.trim() || !section.content.trim());
    if (invalidIndex >= 0) errors.sections = `Sectiunea ${invalidIndex + 1} trebuie sa aiba titlu si continut.`;
  }
  return errors;
}

interface LessonModalProps {
  editLesson: Lesson | null;
  onSave: (data: LessonFormData) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function LessonModal({ editLesson, onSave, onClose, isSaving }: LessonModalProps) {
  const [form, setForm] = useState<LessonFormData>(
    editLesson
      ? {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
          <h3 style={{ fontFamily: 'var(--font-display)' }}>{editLesson ? 'Editeaza Lectie' : 'Lectie Noua'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>x</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="form-group">
              <label className="form-label">Titlu *</label>
              <input
                name="title"
                className={`form-input${fe('title') ? ' is-error' : ''}`}
                value={form.title}
                onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                onChange={handleChange}
                placeholder="Ex: Reactii de oxido-reducere"
              />
              {fe('title') && <span className="form-error">{fe('title')}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Descriere *</label>
              <textarea
                name="description"
                className={`form-input${fe('description') ? ' is-error' : ''}`}
                value={form.description}
                onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                onChange={handleChange}
                rows={3}
                placeholder="Scurta descriere a lectiei..."
              />
              {fe('description') && <span className="form-error">{fe('description')}</span>}
            </div>

            <div className="grid-form-2">
              <div className="form-group">
                <label className="form-label">Categorie</label>
                <select name="category" className="form-input" value={form.category} onChange={handleChange}>
                  {(Object.entries(CATEGORY_LABELS) as [LessonCategory, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Dificultate</label>
                <select name="difficulty" className="form-input" value={form.difficulty} onChange={handleChange}>
                  {(Object.entries(DIFFICULTY_LABELS) as [LessonDifficulty, string][]).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Durata (minute) *</label>
              <input
                name="duration"
                type="number"
                min={5}
                max={240}
                className={`form-input${fe('duration') ? ' is-error' : ''}`}
                value={form.duration}
                onBlur={() => setTouched((prev) => ({ ...prev, duration: true }))}
                onChange={handleChange}
              />
              {fe('duration') && <span className="form-error">{fe('duration')}</span>}
            </div>

            <div className="form-group">
              <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
                <label className="form-label" style={{ margin: 0 }}>Sectiuni *</label>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateForm({ ...form, sections: [...form.sections, newSection()] })}>
                  + Sectiune
                </button>
              </div>
              {fe('sections') && <span className="form-error">{fe('sections')}</span>}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 10 }}>
                {form.sections.map((section, index) => (
                  <div key={section.id} className="card" style={{ padding: 14, background: 'var(--bg-elevated)' }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
                      <strong>Sectiunea {index + 1}</strong>
                      <button type="button" className="btn btn-danger btn-sm" disabled={form.sections.length === 1} onClick={() => removeSection(section.id)}>
                        Sterge
                      </button>
                    </div>
                    <input
                      className="form-input"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      placeholder="Titlul sectiunii"
                    />
                    <textarea
                      className="form-input"
                      style={{ marginTop: 10 }}
                      rows={5}
                      value={section.content}
                      onChange={(e) => updateSection(section.id, { content: e.target.value })}
                      placeholder="Continutul lectiei"
                    />
                    <input
                      className="form-input"
                      style={{ marginTop: 10 }}
                      value={section.formula ?? ''}
                      onChange={(e) => updateSection(section.id, { formula: e.target.value })}
                      placeholder="Formula optionala"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Anulare</button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Salvare...' : editLesson ? 'Actualizeaza' : 'Creeaza Lectie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminLessonsPage() {
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
      setLessons(await LessonService.getAll());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la incarcare.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

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
        showToast('Lectia a fost actualizata.');
      } else {
        const created = await LessonService.create(data);
        setLessons((prev) => [...prev, created]);
        showToast('Lectia a fost creata.');
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
      showToast('Lectia a fost stearsa.');
      setDeleteTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la stergere.');
    }
  };

  if (loading) return <div className="state-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast && <div className="alert alert-success">{toast}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="page-header">
        <div>
          <h2>Administrare Lectii</h2>
          <p className="page-header__sub">{filtered.length} din {lessons.length} lectii</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditLesson(null); setShowForm(true); }}>+ Lectie noua</button>
      </div>

      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="form-input" placeholder="Cauta lectii..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="state-center">
          <p className="state-label">Nu exista lectii pentru criteriile curente.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Categorie</th>
                <th>Nivel</th>
                <th>Sectiuni</th>
                <th>Durata</th>
                <th>Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lesson) => (
                <tr key={lesson.id}>
                  <td className="font-bold">{lesson.title}</td>
                  <td>{CATEGORY_LABELS[lesson.category]}</td>
                  <td><span className="badge badge-neutral">{DIFFICULTY_LABELS[lesson.difficulty]}</span></td>
                  <td className="font-mono text-center">{lesson.sections.length}</td>
                  <td>{lesson.duration} min</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditLesson(lesson); setShowForm(true); }}>Editeaza</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(lesson)}>Sterge</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <LessonModal editLesson={editLesson} onSave={handleSave} onClose={() => { setShowForm(false); setEditLesson(null); }} isSaving={isSaving} />
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
          <div className="modal" style={{ maxWidth: 420 }}>
            <div className="modal__header">
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}>Confirmare stergere</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(null)}>x</button>
            </div>
            <p className="text-muted">Stergi lectia:</p>
            <p className="font-bold" style={{ marginTop: 12 }}>{deleteTarget.title}</p>
            <div className="modal__footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Anulare</button>
              <button className="btn btn-danger" onClick={handleDelete}>Sterge</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
