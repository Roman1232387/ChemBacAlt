import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestService }   from '../services/TestService';
import { ResultService } from '../services/ResultService';
import { useAuth } from '../hooks/useAuth';
import type { Test } from '../models/Test';
import type { UserAnswer } from '../models/Question';

type Phase = 'preview' | 'active' | 'submitting';

export function TakeTestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test,      setTest]      = useState<Test | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [phase,     setPhase]     = useState<Phase>('preview');
  const [answers,   setAnswers]   = useState<UserAnswer[]>([]);
  const [startedAt, setStartedAt] = useState('');
  const [curQ,      setCurQ]      = useState(0);

  useEffect(() => {
    if (!id) return;
    TestService.getById(id)
      .then(setTest)
      .catch((e) => setError(e instanceof Error ? e.message : 'Eroare.'))
      .finally(() => setLoading(false));
  }, [id]);

  const startTest = useCallback(() => {
    if (!test) return;
    setAnswers(test.questions.map((q) => ({ questionId: q.id, selectedOptionIds: [] })));
    setStartedAt(new Date().toISOString());
    setCurQ(0);
    setPhase('active');
  }, [test]);

  const toggleOption = useCallback((qId: string, optId: string, type: string) => {
    setAnswers((prev) => prev.map((a) => {
      if (a.questionId !== qId) return a;
      if (type === 'single' || type === 'true-false') return { ...a, selectedOptionIds: [optId] };
      const ids = a.selectedOptionIds.includes(optId)
        ? a.selectedOptionIds.filter((x) => x !== optId)
        : [...a.selectedOptionIds, optId];
      return { ...a, selectedOptionIds: ids };
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!test || !user) return;
    setPhase('submitting');
    try {
      const result = await ResultService.submit(user.id, test, answers, startedAt);
      navigate(`/rezultate/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la trimitere.');
      setPhase('active');
    }
  }, [test, user, answers, startedAt, navigate]);

  const progress = useMemo(() => {
    if (!test) return 0;
    const answered = answers.filter((a) => a.selectedOptionIds.length > 0).length;
    return Math.round((answered / test.questions.length) * 100);
  }, [answers, test]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error)   return <div className="state-center state-error"><p>⚠ {error}</p><button className="btn btn-secondary" onClick={() => navigate('/teste')}>Inapoi</button></div>;
  if (!test)   return null;

  /* ── Preview ── */
  if (phase === 'preview') return (
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate('/teste')}>← Inapoi</button>
      <div className="card text-center" style={{ padding: '48px 40px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>◉</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 10 }}>{test.title}</h2>
        <p className="text-muted" style={{ marginBottom: 32 }}>{test.description}</p>
        <div className="grid-stats" style={{ marginBottom: 32 }}>
          <div className="stat-card"><div className="stat-card__value">{test.questions.length}</div><div className="stat-card__label">Intrebari</div></div>
          <div className="stat-card"><div className="stat-card__value">{test.duration}</div><div className="stat-card__label">Minute</div></div>
          <div className="stat-card"><div className="stat-card__value" style={{ color: 'var(--amber)' }}>{test.passingScore}%</div><div className="stat-card__label">Promovare</div></div>
        </div>
        <button className="btn btn-primary btn-lg" onClick={startTest}>Incepe testul →</button>
      </div>
    </div>
  );

  /* ── Active ── */
  const q = test.questions[curQ];
  const curAns = answers.find((a) => a.questionId === q.id);

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Progress header */}
      <div style={{ marginBottom: 24 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
          <span className="text-sm text-muted">Intrebarea {curQ + 1} din {test.questions.length}</span>
          <span className="text-sm text-muted">Completat: {progress}%</span>
        </div>
        <div className="progress-bar">
          <div className={`progress-bar__fill progress-bar__fill--teal`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="flex justify-between items-center mb-4">
          <span className="badge badge-teal">
            {q.type === 'single' ? 'Un singur raspuns' : q.type === 'multiple' ? 'Raspuns multiplu' : 'Adevarat / Fals'}
          </span>
          <span className="badge badge-amber">{q.points} puncte</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.45, marginBottom: 24 }}>{q.text}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map((opt) => {
            const sel = curAns?.selectedOptionIds.includes(opt.id);
            return (
              <button key={opt.id} onClick={() => toggleOption(q.id, opt.id, q.type)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
                  background: sel ? 'var(--teal-dim)' : 'var(--bg-elevated)',
                  border: `1px solid ${sel ? 'var(--teal)' : 'var(--border)'}`,
                  borderRadius: 'var(--r-md)', color: sel ? 'var(--teal)' : 'var(--text-primary)',
                  fontWeight: sel ? 700 : 400, fontSize: '0.95rem', textAlign: 'left',
                  cursor: 'pointer', transition: 'all var(--t-fast)' }}
              >
                <span style={{ width: 22, height: 22, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${sel ? 'var(--teal)' : 'var(--text-muted)'}`,
                  borderRadius: q.type === 'multiple' ? 4 : '50%',
                  background: sel ? 'var(--teal)' : 'transparent',
                  color: 'var(--bg-base)', fontSize: '0.7rem', fontWeight: 900 }}>
                  {sel && '✓'}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button className="btn btn-secondary" disabled={curQ === 0} onClick={() => setCurQ((q) => q - 1)}>← Anterior</button>
        {curQ < test.questions.length - 1
          ? <button className="btn btn-primary" onClick={() => setCurQ((q) => q + 1)}>Urmator →</button>
          : <button className="btn btn-primary" onClick={handleSubmit} disabled={phase === 'submitting'}>
              {phase === 'submitting'
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Se trimite...</>
                : '✓ Finalizeaza testul'}
            </button>}
      </div>

      {/* Question dots */}
      <div className="flex flex-wrap gap-2 justify-center" style={{ marginTop: 24 }}>
        {test.questions.map((qq, i) => {
          const ans = answers.find((a) => a.questionId === qq.id);
          const answered = (ans?.selectedOptionIds.length ?? 0) > 0;
          return (
            <button key={qq.id} onClick={() => setCurQ(i)}
              style={{ width: 32, height: 32, borderRadius: '50%', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                border: `2px solid ${i === curQ ? 'var(--teal)' : answered ? 'var(--green)' : 'var(--border)'}`,
                background: i === curQ ? 'var(--teal-dim)' : answered ? 'var(--green-dim)' : 'var(--bg-elevated)',
                color: i === curQ ? 'var(--teal)' : answered ? 'var(--green)' : 'var(--text-muted)',
                transition: 'all var(--t-fast)' }}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
