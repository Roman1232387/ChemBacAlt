import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TestService }   from '../../services/TestService';
import { LessonService } from '../../services/LessonService';
import { useAuth } from '../../hooks/useAuth';
import type { Test, TestFormData, TestStatus } from '../../models/Test';
import type { Lesson } from '../../models/Lesson';
import type { Question, QuestionStep, QuestionType } from '../../models/Question';
import { TEST_STATUS_LABELS } from '../../models/Test';
import { CustomSelect } from '../../components/ui/CustomSelect';

// ─── Form Validation ──────────────────────────────────────────────────────────
interface FE { title?: string; description?: string; lessonId?: string; duration?: string; passingScore?: string; questions?: string; }

function validateForm(d: TestFormData): FE {
  const e: FE = {};
  if (!d.title.trim()) e.title = 'Titlul este obligatoriu.';
  else if (d.title.trim().length < 5) e.title = 'Titlul trebuie să aibă minim 5 caractere.';
  if (!d.description.trim()) e.description = 'Descrierea este obligatorie.';
  else if (d.description.trim().length < 10) e.description = 'Descrierea trebuie să aibă minim 10 caractere.';
  if (!d.lessonId) e.lessonId = 'Selectați o lecție.';
  if (d.duration < 5 || d.duration > 60) e.duration = 'Durata trebuie să fie între 5 și 60 de minute.';
  if (d.passingScore < 10 || d.passingScore > 100) e.passingScore = 'Scorul de promovare trebuie să fie între 10% și 100%.';
  if (d.questions.length === 0) e.questions = 'Adăugați cel puțin o întrebare.';
  else {
    const invalidIndex = d.questions.findIndex((q) => {
      if (!q.text.trim() || q.points < 1) return true;
      if (q.type === 'stepped') {
        return q.steps.length < 2 || q.steps.some((step) => !step.prompt.trim() || !step.correctAnswer.trim() || step.points < 1);
      }
      if (q.type === 'true-false' || q.type === 'true_false') {
        return q.options.length !== 2 || !q.options.some((o) => o.isCorrect);
      }
      return q.options.length < 2 || q.options.some((o) => !o.text.trim()) || !q.options.some((o) => o.isCorrect);
    });
    if (invalidIndex >= 0) e.questions = `Întrebarea ${invalidIndex + 1} are erori (verifică textul, opțiunile și răspunsul corect).`;
  }
  return e;
}

const trueFalseOptions = (correct: 'true' | 'false' = 'true') => [
  { id: `tmp-${Date.now()}-true`, text: 'Adevărat', isCorrect: correct === 'true' },
  { id: `tmp-${Date.now()}-false`, text: 'Fals', isCorrect: correct === 'false' },
];

const normalizeQuestionForForm = (question: Question): Question => {
  if (question.type !== 'true-false' && question.type !== 'true_false') return question;
  const correctText = question.options.find((option) => option.isCorrect)?.text.toLowerCase() ?? 'adevărat';
  return {
    ...question,
    steps: [],
    options: trueFalseOptions(correctText.includes('fals') ? 'false' : 'true'),
  };
};

const newStep = (): QuestionStep => ({
  id: `tmp-step-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  order: 1,
  prompt: '',
  correctAnswer: '',
  stepType: 'numeric',
  tolerance: 0.01,
  points: 1,
  unit: '',
});

const newQuestion = () => ({
  id: `tmp-${Date.now()}`,
  text: '',
  type: 'single' as QuestionType,
  explanation: '',
  points: 1,
  steps: [],
  options: [
    { id: `tmp-${Date.now()}-1`, text: '', isCorrect: true },
    { id: `tmp-${Date.now()}-2`, text: '', isCorrect: false },
  ],
});

const emptyForm = (): TestFormData => ({
  title: '',
  description: '',
  lessonId: '',
  questions: [newQuestion()],
  duration: 60,
  passingScore: 60,
  status: 'draft'
});

// ─── TestModal ─────────────────────────────────────────────────────────────────
interface TestModalProps {
  editTest: Test | null;
  lessons: Lesson[];
  onSave: (data: TestFormData) => Promise<void>;
  onClose: () => void;
  isSaving: boolean;
}

function TestModal({ editTest, lessons, onSave, onClose, isSaving }: TestModalProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<TestFormData>(
    editTest
      ? { title: editTest.title, description: editTest.description, lessonId: editTest.lessonId, questions: editTest.questions.length ? editTest.questions.map(normalizeQuestionForForm) : [newQuestion()], duration: editTest.duration, passingScore: editTest.passingScore, status: editTest.status }
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

  const updateQuestions = (questions: TestFormData['questions']) => {
    const next = { ...form, questions };
    setForm(next);
    setErrors(validateForm(next));
  };

  const updateQuestion = (questionId: string, patch: Partial<TestFormData['questions'][number]>) => {
    updateQuestions(form.questions.map((q) => {
      if (q.id !== questionId) return q;
      const updated = { ...q, ...patch };
      if (patch.type === 'stepped' && updated.steps.length === 0) {
        updated.steps = [{ ...newStep(), order: 1 }, { ...newStep(), order: 2 }];
        updated.options = [];
      }
      if (patch.type === 'true-false' || patch.type === 'true_false') {
        updated.steps = [];
        updated.options = trueFalseOptions('true');
      }
      if (patch.type && patch.type !== 'stepped' && updated.options.length === 0) {
        updated.options = [
          { id: `tmp-${Date.now()}-1`, text: '', isCorrect: true },
          { id: `tmp-${Date.now()}-2`, text: '', isCorrect: false },
        ];
      }
      if (patch.type && patch.type !== 'multiple') {
        let foundCorrect = false;
        updated.options = updated.options.map((o) => {
          if (o.isCorrect && !foundCorrect) {
            foundCorrect = true;
            return o;
          }
          return { ...o, isCorrect: false };
        });
        if (!foundCorrect && updated.options[0]) updated.options[0] = { ...updated.options[0], isCorrect: true };
      }
      return updated;
    }));
  };

  const updateStep = (questionId: string, stepId: string, patch: Partial<QuestionStep>) => {
    updateQuestions(form.questions.map((q) => {
      if (q.id !== questionId) return q;
      const steps = q.steps.map((step) => step.id === stepId ? { ...step, ...patch } : step);
      const points = steps.reduce((sum, s) => sum + s.points, 0);
      return { ...q, steps, points };
    }));
  };

  const addStep = (questionId: string) => {
    updateQuestions(form.questions.map((q) => {
      if (q.id !== questionId) return q;
      const steps = [...q.steps, { ...newStep(), order: q.steps.length + 1 }];
      const points = steps.reduce((sum, s) => sum + s.points, 0);
      return { ...q, steps, points };
    }));
  };

  const removeStep = (questionId: string, stepId: string) => {
    updateQuestions(form.questions.map((q) => {
      if (q.id !== questionId || q.steps.length <= 2) return q;
      const steps = q.steps.filter((step) => step.id !== stepId).map((step, index) => ({ ...step, order: index + 1 }));
      const points = steps.reduce((sum, s) => sum + s.points, 0);
      return { ...q, steps, points };
    }));
  };

  const updateOption = (questionId: string, optionId: string, text: string) => {
    updateQuestions(form.questions.map((q) => q.id === questionId
      ? {
          ...q,
          options: q.type === 'true-false' || q.type === 'true_false'
            ? q.options
            : q.options.map((o) => o.id === optionId ? { ...o, text } : o),
        }
      : q));
  };

  const toggleCorrect = (questionId: string, optionId: string) => {
    updateQuestions(form.questions.map((q) => {
      if (q.id !== questionId) return q;
      return {
        ...q,
        options: q.options.map((o) => q.type === 'multiple'
          ? o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o
          : { ...o, isCorrect: o.id === optionId })
      };
    }));
  };

  const addOption = (questionId: string) => {
    updateQuestions(form.questions.map((q) => q.id === questionId
      ? { ...q, options: [...q.options, { id: `tmp-${Date.now()}`, text: '', isCorrect: false }] }
      : q));
  };

  const removeOption = (questionId: string, optionId: string) => {
    updateQuestions(form.questions.map((q) => {
      if (q.id !== questionId || q.options.length <= 2) return q;
      const options = q.options.filter((o) => o.id !== optionId);
      if (!options.some((o) => o.isCorrect)) options[0] = { ...options[0], isCorrect: true };
      return { ...q, options };
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--amber)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Evaluare & Testare
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginTop: 4 }}>
              {editTest ? 'Editează testul' : 'Creează un test nou'}
            </h3>
          </div>
          <button className="modal__close" onClick={onClose} title="Închide">✕</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="admin-form-container">
          <div className="modal__body">
            <div className="admin-form-grid">
              <div className="admin-form-box">
                <div className="admin-form-box__title">Configurație Test</div>
                <div className="flex-col gap-3">
                  <div className="form-group">
                    <label className="form-label">Titlu Test *</label>
                    <input name="title" className={`form-input${fe('title') ? ' is-error' : ''}`}
                      value={form.title} onChange={handleChange} onBlur={handleBlur}
                      placeholder="Ex: Test Redox - nivel mediu" />
                    {fe('title') && <span className="form-error">⚠ {fe('title')}</span>}
                  </div>
                  <div className="form-group">
                    <CustomSelect
                      label="Lecție Asociată *"
                      placeholder="Alege lecția..."
                      value={form.lessonId}
                      onChange={(val) => setForm((p) => ({ ...p, lessonId: val }))}
                      options={lessons.map((l) => ({ value: l.id, label: l.title }))}
                    />
                    {fe('lessonId') && <span className="form-error">⚠ {fe('lessonId')}</span>}
                  </div>
                </div>
              </div>

              <div className="admin-form-box">
                <div className="admin-form-box__title">Parametri Evaluare</div>
                <div className="grid-form-2">
                  <div className="form-group">
                    <label className="form-label">Durata (min) *</label>
                    <input name="duration" type="number" min={5} max={60}
                      className={`form-input${fe('duration') ? ' is-error' : ''}`}
                      value={form.duration} onChange={handleChange} onBlur={handleBlur} />
                    {fe('duration') && <span className="form-error">⚠ {fe('duration')}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Promovare (%) *</label>
                    <input name="passingScore" type="number" min={10} max={100}
                      className={`form-input${fe('passingScore') ? ' is-error' : ''}`}
                      value={form.passingScore} onChange={handleChange} onBlur={handleBlur} />
                    {fe('passingScore') && <span className="form-error">⚠ {fe('passingScore')}</span>}
                  </div>
                </div>
                <div className="form-group mt-3">
                  <CustomSelect
                    label="Status Vizibilitate"
                    value={form.status}
                    onChange={(val) => setForm((p) => ({ ...p, status: val as TestStatus }))}
                    options={Object.entries(TEST_STATUS_LABELS).map(([key, label]) => ({ value: key, label }))}
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-box">
              <div className="admin-form-box__title">Descriere Test</div>
              <textarea name="description" className={`form-input${fe('description') ? ' is-error' : ''}`}
                value={form.description} onChange={handleChange} onBlur={handleBlur} rows={2}
                placeholder="Explică elevului ce tip de probleme sau teorie se regăsește în acest test..." />
              {fe('description') && <span className="form-error">⚠ {fe('description')}</span>}
            </div>

            <div className="admin-form-box" style={{ background: 'rgba(0, 212, 170, 0.03)' }}>
              <div className="admin-form-box__title">Întrebări și Punctaj</div>
              
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted">Construiește structura testului. Punctajul total va fi calculat automat.</p>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => updateQuestions([...form.questions, newQuestion()])}>
                  + Adaugă Întrebare
                </button>
              </div>

              {fe('questions') && <div className="alert alert-error mb-4">⚠ {fe('questions')}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {form.questions.map((question, qIndex) => (
                  <div key={question.id} className="admin-accordion">
                    <div 
                      className="admin-accordion__header"
                      onClick={() => setExpandedQuestions(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                      style={{ cursor: 'pointer', borderLeft: (qIndex === form.questions.length - 1 || expandedQuestions[question.id]) ? '4px solid var(--teal)' : 'none' }}
                    >
                      <div className="admin-accordion__title">
                        <span className="badge badge-teal" style={{ width: 24, height: 24, borderRadius: '50%', padding: 0, justifyContent: 'center' }}>
                          {qIndex + 1}
                        </span>
                        <span style={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {question.text || `Întrebarea ${qIndex + 1}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-xs text-muted font-bold uppercase">{question.type}</div>
                        <button
                          type="button"
                          className="text-red hover:opacity-80"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                          onClick={(e) => { e.stopPropagation(); updateQuestions(form.questions.filter((q) => q.id !== question.id)); }}
                        >
                          Elimină
                        </button>
                        <span style={{ transform: expandedQuestions[question.id] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          ▼
                        </span>
                      </div>
                    </div>

                    {(expandedQuestions[question.id] || qIndex === form.questions.length - 1) && (
                      <div className="admin-accordion__content">
                        <div className="form-group mb-4">
                          <label className="form-label text-xs uppercase">Enunț Întrebare</label>
                          <textarea
                            className="form-input"
                            rows={2}
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                            placeholder="Introdu enunțul problemei..."
                          />
                        </div>

                        <div className="grid-form-2 mb-4">
                          <div className="form-group">
                            <CustomSelect
                              label="Tip Întrebare"
                              value={question.type}
                              onChange={(val) => updateQuestion(question.id, { type: val as QuestionType })}
                              options={[
                                { value: 'single', label: 'Un singur răspuns (Radio)' },
                                { value: 'multiple', label: 'Răspuns multiplu (Checkbox)' },
                                { value: 'true-false', label: 'Adevărat / Fals (Selectoare)' },
                                { value: 'stepped', label: 'Calcul pe etape (Secvențial)' },
                              ]}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-xs uppercase">Punctaj Întrebare</label>
                            <input
                              className="form-input"
                              type="number"
                              min={1}
                              value={question.points}
                              readOnly={question.type === 'stepped'}
                              onChange={(e) => updateQuestion(question.id, { points: Number(e.target.value) })}
                              style={question.type === 'stepped' ? { opacity: 0.7, cursor: 'not-allowed', background: 'var(--bg-elevated)' } : {}}
                            />
                            {question.type === 'stepped' && <span className="text-xs text-muted">Calculat automat din etape</span>}
                          </div>
                        </div>

                        <div className="form-group mb-4">
                          <label className="form-label text-xs uppercase">Explicație (afișată la final)</label>
                          <textarea
                            className="form-input"
                            rows={1}
                            value={question.explanation}
                            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                            placeholder="Explică raționamentul răspunsului corect..."
                          />
                        </div>

                        {question.type === 'stepped' ? (
                          <div className="admin-form-box" style={{ background: 'rgba(255, 255, 255, 0.05)', marginTop: 10 }}>
                            <div className="flex justify-between items-center mb-3">
                              <strong style={{ fontSize: '0.85rem' }}>Etape de calcul necesare</strong>
                              <button type="button" className="btn btn-secondary btn-sm" onClick={() => addStep(question.id)}>+ Adaugă Etapă</button>
                            </div>
                            <div className="flex-col gap-3">
                              {question.steps.map((step, stepIndex) => (
                                <div key={step.id} className="admin-card" style={{ display: 'block', padding: 14, background: 'rgba(15, 22, 40, 0.6)' }}>
                                  <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-teal">Etapa {stepIndex + 1}</span>
                                    <button type="button" className="btn btn-ghost btn-sm" disabled={question.steps.length <= 2} onClick={() => removeStep(question.id, step.id)}>✕</button>
                                  </div>
                                  <textarea
                                    className="form-input mb-3"
                                    rows={1}
                                    value={step.prompt}
                                    onChange={(e) => updateStep(question.id, step.id, { prompt: e.target.value })}
                                    placeholder="Ce trebuie să calculeze elevul?"
                                  />
                                  <div className="grid-form-2">
                                    <div className="form-group">
                                      <label className="form-label">Răspuns Corect</label>
                                      <input
                                        className="form-input font-mono"
                                        value={step.correctAnswer}
                                        onChange={(e) => updateStep(question.id, step.id, { correctAnswer: e.target.value })}
                                        placeholder="Valoare numerică sau text"
                                      />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label">Tip Răspuns</label>
                                      <CustomSelect
                                        value={step.stepType}
                                        onChange={(val) => updateStep(question.id, step.id, { stepType: val as QuestionStep['stepType'] })}
                                        options={[
                                          { value: 'numeric', label: 'Numeric (cu toleranță)' },
                                          { value: 'text', label: 'Text (exact)' }
                                        ]}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid-form-2 mt-3">
                                    <div className="form-group">
                                      <label className="form-label text-xs">Unitate de măsură</label>
                                      <input className="form-input" value={step.unit ?? ''} onChange={(e) => updateStep(question.id, step.id, { unit: e.target.value })} placeholder="Ex: g, mol/L, %" />
                                    </div>
                                    <div className="form-group">
                                      <label className="form-label text-xs">Puncte etapă</label>
                                      <input className="form-input" type="number" min={1} value={step.points} onChange={(e) => updateStep(question.id, step.id, { points: Number(e.target.value) })} />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="admin-form-box" style={{ background: 'rgba(255, 255, 255, 0.05)', marginTop: 10 }}>
                            <div className="flex justify-between items-center mb-3">
                              <strong style={{ fontSize: '0.85rem' }}>Opțiuni de răspuns</strong>
                              {!(question.type === 'true-false' || question.type === 'true_false') && (
                                <button type="button" className="btn btn-ghost btn-sm" onClick={() => addOption(question.id)}>+ Adaugă Variantă</button>
                              )}
                            </div>
                            <div className="flex-col gap-3">
                              {question.type === 'true-false' || question.type === 'true_false' ? (
                                <div className="tf-admin-toggle">
                                  {question.options.map((option) => (
                                    <button
                                      key={option.id}
                                      type="button"
                                      className={`tf-admin-btn${option.isCorrect ? ' tf-admin-btn--active' : ''}`}
                                      onClick={() => toggleCorrect(question.id, option.id)}
                                    >
                                      <span>{option.text === 'Adevărat' ? '✅' : '❌'}</span>
                                      {option.text} {option.isCorrect && ' (Corect)'}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                question.options.map((option, oIndex) => (
                                  <div key={option.id} className="admin-card" style={{ padding: 12, background: 'rgba(15, 22, 40, 0.6)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12, alignItems: 'center' }}>
                                      <div 
                                        onClick={() => toggleCorrect(question.id, option.id)}
                                        style={{ 
                                          cursor: 'pointer', width: 22, height: 22, borderRadius: question.type === 'multiple' ? '4px' : '50%',
                                          border: `2px solid ${option.isCorrect ? 'var(--teal)' : 'var(--text-muted)'}`,
                                          background: option.isCorrect ? 'var(--teal)' : 'transparent',
                                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-base)', fontSize: '0.7rem'
                                        }}
                                      >
                                        {option.isCorrect && '✓'}
                                      </div>
                                      <input
                                        className="form-input"
                                        value={option.text}
                                        onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                        placeholder={`Varianta ${oIndex + 1}`}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-ghost btn-sm"
                                        disabled={question.options.length <= 2}
                                        onClick={() => removeOption(question.id, option.id)}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
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
              {isSaving
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Salvare...</>
                : editTest ? '✓ Actualizează' : '+ Creează test'}
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
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--red)' }}>Confirmare ștergere</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <p className="text-muted" style={{ lineHeight: 1.65 }}>
          Ești sigur că dorești să ștergi testul:
        </p>
        <p className="font-bold" style={{ marginTop: 12, marginBottom: 12 }}>„{test.title}"</p>
        <p style={{ color: 'var(--red)', fontSize: '0.88rem' }}>⚠ Această acțiune este ireversibilă.</p>
        <div className="modal__footer">
          <button className="btn btn-secondary" onClick={onClose}>Anulare</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting
              ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Ștergere...</>
              : '🗑 Șterge definitiv'}
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
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare la încărcare.'); }
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
      showToast('Testul a fost șters.');
      setDeleteTarget(null);
    } catch (e) { setError(e instanceof Error ? e.message : 'Eroare la ștergere.'); }
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
          <input className="form-input" placeholder="Caută teste..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div style={{ width: 180 }}>
          <CustomSelect
            placeholder="Orice status"
            value={statFlt}
            onChange={(val) => setStatFlt(val as TestStatus | '')}
            options={[
              { value: '', label: 'Orice status' },
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Publicat' },
              { value: 'archived', label: 'Arhivat' }
            ]}
          />
        </div>
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
          <p className="state-label">{tests.length === 0 ? 'Nu există teste. Creează primul!' : 'Niciun test nu corespunde filtrelor.'}</p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Titlu</th>
                <th>Lecție</th>
                <th>Întrebări</th>
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
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditTest(t); setShowForm(true); }}>✎ Editează</button>
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
