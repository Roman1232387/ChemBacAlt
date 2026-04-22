import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TestService }   from '../../services/TestService';
import { LessonService } from '../../services/LessonService';
import { useAuth } from '../../hooks/useAuth';
import type { Test, TestFormData, TestStatus } from '../../models/Test';
import type { Lesson } from '../../models/Lesson';
import { TEST_STATUS_LABELS } from '../../models/Test';

// ─── Form Validation ──────────────────────────────────────────────────────────
interface FE { title?: string; description?: string; lessonId?: string; duration?: string; passingScore?: string; }

function validateForm(d: TestFormData): FE {
  const e: FE = {};
  if (!d.title.trim()) e.title = 'Titlul este obligatoriu.';
  else if (d.title.trim().length < 5) e.title = 'Titlul trebuie sa aiba minim 5 caractere.';
  if (!d.description.trim()) e.description = 'Descrierea este obligatorie.';
  else if (d.description.trim().length < 10) e.description = 'Descrierea trebuie sa aiba minim 10 caractere.';
  if (!d.lessonId) e.lessonId = 'Selectati o lectie.';
  if (d.duration < 5 || d.duration > 180) e.duration = 'Durata trebuie sa fie intre 5 si 180 de minute.';
  if (d.passingScore < 10 || d.passingScore > 100) e.passingScore = 'Scorul de promovare trebuie sa fie intre 10% si 100%.';
  return e;
}

const emptyForm = (): TestFormData => ({ title: '', description: '', lessonId: '', duration: 30, passingScore: 60, status: 'draft' });

// ─── TestModal ─────────────────────────────────────────────────────────────────
interface TestModalProps {
  editTest: Test | null;
  lessons: Lesson[];
  onSave: (data: TestFormData) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function TestModal({ editTest, lessons, onSave, onClose, isSaving }: TestModalProps) {
  const [form, setForm] = useState<TestFormData>(
    editTest
      ? { title: editTest.title, description: editTest.description, lessonId: editTest.lessonId, duration: editTest.duration, passingScore: editTest.passingScore, status: editTest.status }
      : emptyForm()
  );
  const [errors,  setErrors]  = useState<FE>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const val = (name === 'duration' || name === 'passingScore') ? Number(value) : value;
    setForm((p) => ({ ...p, [name]: val }));
    setErrors(validateForm({ ...form, [name]: val }));
  };
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setTouched((p) => ({ ...p, [(e.target as HTMLInputElement).name]: true }));
  };
  const fe = (f: keyof FE) => touched[f] ? errors[f] : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    await onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal__header">
          <h3 style={{ fontFamily: 'var(--font-display)' }}>{editTest ? 'Editeaza Test' : 'Test Nou'}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="modal__body">
            <div className="form-group">
              <label className="form-label">Titlu *</label>
              <input name="title" className={`form-input${fe('title') ? ' is-error' : ''}`}
                value={form.title} onChange={handleChange} onBlur={handleBlur}
                placeholder="Ex: Test Redox – Nivel Mediu" />
              {fe('title') && <span className="form-error">⚠ {fe('title')}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Descriere *</label>
              <textarea name="description" className={`form-input${fe('description') ? ' is-error' : ''}`}
                value={form.description} onChange={handleChange} onBlur={handleBlur} rows={3}
                placeholder="Descriere detaliata a testului..." />
              {fe('description') && <span className="form-error">⚠ {fe('description')}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Lectie asociata *</label>
              <select name="lessonId" className={`form-input${fe('lessonId') ? ' is-error' : ''}`}
                value={form.lessonId} onChange={handleChange} onBlur={handleBlur}>
                <option value="">-- Selecteaza lectia --</option>
                {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
              </select>
              {fe('lessonId') && <span className="form-error">⚠ {fe('lessonId')}</span>}
            </div>
            <div className="grid-form-2">
              <div className="form-group">
                <label className="form-label">Durata (minute) *</label>
                <input name="duration" type="number" min={5} max={180}
                  className={`form-input${fe('duration') ? ' is-error' : ''}`}
                  value={form.duration} onChange={handleChange} onBlur={handleBlur} />
                {fe('duration') && <span className="form-error">⚠ {fe('duration')}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Scor promovare (%) *</label>
                <input name="passingScore" type="number" min={10} max={100}
                  className={`form-input${fe('passingScore') ? ' is-error' : ''}`}
                  value={form.passingScore} onChange={handleChange} onBlur={handleBlur} />
                {fe('passingScore') && <span className="form-error">⚠ {fe('passingScore')}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={form.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="published">Publicat</option>
                <option value="archived">Arhivat</option>
              </select>
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Anulare</button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Salvare...</>
                : editTest ? '✓ Actualizeaza' : '+ Creeaza Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── DeleteModal ──────────────────────────────────────────────────────────────
interface DelModalProps { test: Test; onConfirm: () => Promise<void>; onClose: () => void; isDeleting: boolean; }

function DeleteModal({ test, onConfirm, onClose, isDeleting }: DelModalProps) {
  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: 420 }}>
        <div className="modal__header">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}>Confirmare stergere</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <p className="text-muted" style={{ lineHeight: 1.65 }}>
          Esti sigur ca doresti sa stergi testul:
        </p>
        <p className="font-bold" style={{ marginTop: 12, marginBottom: 12 }}>„{test.title}"</p>
        <p style={{ color: 'var(--red)', fontSize: '0.88rem' }}>⚠ Aceasta actiune este ireversibila.</p>
        <div className="modal__footer">
          <button className="btn btn-secondary" onClick={onClose}>Anulare</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting
              ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Stergere...</>
              : '🗑 Sterge definitiv'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<TestStatus, string> = { draft: 'badge-amber', published: 'badge-green', archived: 'badge-neutral' };
type Sort = 'title' | 'status' | 'createdAt';

export function AdminTestsPage() {
  const { user } = useAuth();
  const [tests,   setTests]   = useState<Test[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState('');
  const [statFlt, setStatFlt] = useState<TestStatus | ''>('');
  const [sort,    setSort]    = useState<Sort>('createdAt');
  const [dir,     setDir]     = useState<'asc' | 'desc'>('desc');

  // Modals
  const [showForm,     setShowForm]     = useState(false);
  const [editTest,     setEditTest]     = useState<Test | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Test | null>(null);
  const [isSaving,     setIsSaving]     = useState(false);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [toast,        setToast]        = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [t, l] = await Promise.all([TestService.getAll(), LessonService.getAll()]);
      setTests(t); setLessons(l);
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare la incarcare.'); }
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
    if (statFlt) list = list.filter((t) => t.status === statFlt);
    list.sort((a, b) => {
      const cmp = sort === 'title'     ? a.title.localeCompare(b.title)
                : sort === 'status'    ? a.status.localeCompare(b.status)
                : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return dir === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [tests, search, statFlt, sort, dir]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const toggleSort = (k: Sort) => { if (sort === k) setDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSort(k); setDir('asc'); } };

  const handleSave = async (data: TestFormData) => {
    if (!user) return;
    setIsSaving(true);
    try {
      if (editTest) {
        const updated = await TestService.update(editTest.id, data);
        setTests((p) => p.map((t) => t.id === editTest.id ? updated : t));
        showToast('Testul a fost actualizat cu succes.');
      } else {
        const created = await TestService.create(data, user.id);
        setTests((p) => [...p, created]);
        showToast('Testul a fost creat cu succes.');
      }
      setShowForm(false); setEditTest(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare la salvare.'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await TestService.delete(deleteTarget.id);
      setTests((p) => p.filter((t) => t.id !== deleteTarget.id));
      showToast('Testul a fost sters.');
      setDeleteTarget(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare la stergere.'); }
    finally { setIsDeleting(false); }
  };

  if (loading) return <div className="state-center"><div className="spinner" /></div>;

  return (
    <div>
      {toast  && <div className="alert alert-success">✓ {toast}</div>}
      {error  && <div className="alert alert-error">⚠ {error} <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }} onClick={() => setError(null)}>✕</button></div>}

      <div className="page-header">
        <div><h2>⬙ Administrare Teste</h2><p className="page-header__sub">{filtered.length} din {tests.length} teste</p></div>
        <button className="btn btn-primary" onClick={() => { setEditTest(null); setShowForm(true); }}>+ Test nou</button>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon">⌕</span>
          <input className="form-input" placeholder="Cauta teste..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-input" style={{ width: 'auto', minWidth: 150 }} value={statFlt} onChange={(e) => setStatFlt(e.target.value as TestStatus | '')}>
          <option value="">Orice status</option>
          <option value="draft">Draft</option>
          <option value="published">Publicat</option>
          <option value="archived">Arhivat</option>
        </select>
        {(['title', 'status', 'createdAt'] as Sort[]).map((k) => (
          <button key={k} className={`btn btn-sm ${sort === k ? 'btn-secondary' : 'btn-ghost'}`} onClick={() => toggleSort(k)}>
            {k === 'title' ? 'Titlu' : k === 'status' ? 'Status' : 'Data'}
            {sort === k && (dir === 'asc' ? ' ↑' : ' ↓')}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="state-center">
          <div className="state-icon">⬙</div>
          <p className="state-label">{tests.length === 0 ? 'Nu exista teste. Creeaza primul!' : 'Niciun test nu corespunde filtrelor.'}</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Lectie</th>
                <th>Intrebari</th>
                <th>Durata</th>
                <th>Promovare</th>
                <th>Status</th>
                <th>Data</th>
                <th>Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="font-bold" style={{ maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                  </td>
                  <td className="text-sm text-muted">{lMap[t.lessonId]?.title.slice(0, 28) ?? '–'}…</td>
                  <td className="font-mono text-center">{t.questions.length}</td>
                  <td className="text-sm">{t.duration} min</td>
                  <td className="font-mono">{t.passingScore}%</td>
                  <td><span className={`badge ${STATUS_BADGE[t.status]}`}>{TEST_STATUS_LABELS[t.status]}</span></td>
                  <td className="text-sm text-muted">{new Date(t.createdAt).toLocaleDateString('ro-RO')}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditTest(t); setShowForm(true); }}>✎ Editeaza</button>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(t)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <TestModal editTest={editTest} lessons={lessons} onSave={handleSave} isSaving={isSaving}
          onClose={() => { setShowForm(false); setEditTest(null); }} />
      )}
      {deleteTarget && (
        <DeleteModal test={deleteTarget} onConfirm={handleDelete} isDeleting={isDeleting}
          onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
