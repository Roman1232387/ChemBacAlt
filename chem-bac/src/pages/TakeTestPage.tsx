import React, { Component, type ErrorInfo, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TestService } from '../services/TestService';
import { ResultService } from '../services/ResultService';
import { useAuth } from '../hooks/useAuth';
import type { Test } from '../models/Test';
import type { Question, UserAnswer } from '../models/Question';

type Phase = 'preview' | 'active' | 'submitting';
type SubjectKey = 'I' | 'II' | 'III';

class TakeTestErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error: error.message || 'A apărut o eroare la afișarea testului.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('TakeTestPage error:', error, info);
  }

  render() {
    if (this.state.error) {
      return <div className="state-center state-error"><p>{this.state.error}</p></div>;
    }

    return this.props.children;
  }
}

const getQuestions = (test: Test | null): Question[] => Array.isArray(test?.questions) ? test.questions : [];
const subjectForIndex = (index: number): SubjectKey => index < 10 ? 'I' : index < 20 ? 'II' : 'III';
const subjectTitle = (subject: SubjectKey) => `SUBIECTUL ${subject}`;
const subjectLocalIndex = (index: number) => index < 10 ? index + 1 : index < 20 ? index - 9 : index - 19;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

function computeQuestionPoints(question: Question, answer?: UserAnswer) {
  if (question.type === 'stepped') {
    const max = (question.steps ?? []).reduce((sum, step) => sum + step.points, 0) || question.points;
    const earned = answer?.steppedPointsEarned ?? 0;
    return { earned, max, isCorrect: earned === max && max > 0 };
  }

  const selectedIds = answer?.selectedOptionIds ?? [];
  const correctIds = (question.options ?? []).filter((option) => option.isCorrect).map((option) => option.id);
  const isSingle = question.type === 'single' || question.type === 'true-false' || question.type === 'true_false';
  const isCorrect = isSingle
    ? selectedIds.length === 1 && correctIds.includes(selectedIds[0])
    : selectedIds.length === correctIds.length && correctIds.every((id) => selectedIds.includes(id));

  return { earned: isCorrect ? question.points : 0, max: question.points, isCorrect };
}

export function TakeTestPage() {
  return (
    <TakeTestErrorBoundary>
      <TakeTestContent />
    </TakeTestErrorBoundary>
  );
}

function TakeTestContent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('preview');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [startedAt, setStartedAt] = useState('');
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [curQ, setCurQ] = useState(0);
  const [frozenAnswers, setFrozenAnswers] = useState<Record<string, UserAnswer>>({});
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [stepIndexByQuestion, setStepIndexByQuestion] = useState<Record<string, number>>({});
  const [stepInputs, setStepInputs] = useState<Record<string, string>>({});
  const [stepAttempts, setStepAttempts] = useState<Record<string, number>>({});
  const [stepFeedback, setStepFeedback] = useState<Record<string, string>>({});
  const [answerFeedback, setAnswerFeedback] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!id) {
      setError('Testul nu a fost identificat.');
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);

    TestService.getById(id)
      .then((loadedTest) => {
        if (isMounted) setTest({ ...loadedTest, questions: getQuestions(loadedTest) });
      })
      .catch((e) => {
        if (isMounted) setError(e instanceof Error ? e.message : 'Eroare la încărcarea testului.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  const questions = useMemo(() => getQuestions(test), [test]);
  const currentQuestion = questions[curQ] ?? null;
  const currentOptions = Array.isArray(currentQuestion?.options) ? currentQuestion.options : [];
  const currentSubject = subjectForIndex(curQ);

  const subjectStats = useMemo(() => {
    const stats: Record<SubjectKey, { earned: number; max: number; answered: number; total: number }> = {
      I: { earned: 0, max: 0, answered: 0, total: 0 },
      II: { earned: 0, max: 0, answered: 0, total: 0 },
      III: { earned: 0, max: 0, answered: 0, total: 0 },
    };

    questions.forEach((question, index) => {
      const subject = subjectForIndex(index);
      const answer = answers.find((item) => item.questionId === question.id);
      const points = computeQuestionPoints(question, answer);
      const hasAnswered = question.type === 'stepped'
        ? (stepIndexByQuestion[question.id] ?? 0) >= (question.steps ?? []).length && (question.steps ?? []).length > 0
        : Boolean(checkedQuestions[question.id]);

      stats[subject].earned += points.earned;
      stats[subject].max += points.max;
      stats[subject].total += 1;
      if (hasAnswered) stats[subject].answered += 1;
    });

    return stats;
  }, [answers, checkedQuestions, questions, stepIndexByQuestion]);

  const totalScore = subjectStats.I.earned + subjectStats.II.earned + subjectStats.III.earned;
  const totalMax = subjectStats.I.max + subjectStats.II.max + subjectStats.III.max;

  const isQuestionResolved = useCallback((question: Question) => {
    if (question.type === 'stepped') {
      const steps = question.steps ?? [];
      return steps.length > 0 && (stepIndexByQuestion[question.id] ?? 0) >= steps.length;
    }

    return Boolean(checkedQuestions[question.id]);
  }, [checkedQuestions, stepIndexByQuestion]);

  const allQuestionsResolved = questions.length > 0 && questions.every(isQuestionResolved);

  const handleSubmit = useCallback(async (allowIncomplete = false) => {
    if (!test || !user) {
      setError('Trebuie să fii autentificat pentru a salva rezultatul.');
      return;
    }

    if (!allowIncomplete && !questions.every(isQuestionResolved)) {
      setError('Verifică toate întrebările înainte de finalizare. Răspunsurile neverificate nu se salvează.');
      setPhase('active');
      return;
    }

    const submittedAnswers = questions.map((q) => {
      const frozen = frozenAnswers[q.id];
      if (frozen) return frozen;
      const current = answers.find((a) => a.questionId === q.id);
      if (!current || (!isQuestionResolved(q) && !allowIncomplete)) return { questionId: q.id, selectedOptionIds: [], stepAnswers: {}, steppedPointsEarned: 0 };
      return current;
    });

    setPhase('submitting');
    try {
      const result = await ResultService.submit(user.id, { ...test, questions }, submittedAnswers, startedAt);
      sessionStorage.setItem('test_submitted', 'true');
      navigate(`/rezultate/${result.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Eroare la trimitere.');
      setPhase('active');
    }
  }, [answers, frozenAnswers, isQuestionResolved, navigate, questions, startedAt, test, user]);

  useEffect(() => {
    if (phase !== 'active') return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'active') return;
    if (remainingSeconds <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [handleSubmit, phase, remainingSeconds]);

  const startTest = useCallback(() => {
    if (!test) return;
    if (questions.length === 0) {
      setError('Testul nu are întrebări. Revino după ce administratorul adaugă întrebări.');
      return;
    }

    setAnswers(questions.map((question) => ({ questionId: question.id, selectedOptionIds: [], steppedPointsEarned: 0, stepAnswers: {} })));
    setCheckedQuestions({});
    setStepIndexByQuestion({});
    setStepInputs({});
    setStepAttempts({});
    setStepFeedback({});
    setAnswerFeedback({});
    setStartedAt(new Date().toISOString());
    setRemainingSeconds(test.duration * 60);
    setCurQ(0);
    setPhase('active');
  }, [questions, test]);

  const toggleOption = useCallback((qId: string, optId: string, type: string) => {
    if (checkedQuestions[qId]) return;

    setAnswerFeedback((prev) => ({ ...prev, [qId]: '' }));
    setAnswers((prev) => {
      const newAnswers = prev.map((answer) => {
        if (answer.questionId !== qId) return answer;
        if (type === 'single' || type === 'true-false' || type === 'true_false') {
          return { ...answer, selectedOptionIds: [optId] };
        }

        const ids = answer.selectedOptionIds.includes(optId)
          ? answer.selectedOptionIds.filter((id) => id !== optId)
          : [...answer.selectedOptionIds, optId];
        return { ...answer, selectedOptionIds: ids };
      });

      // Auto-verify for single choice/TF
      if (type === 'single' || type === 'true-false' || type === 'true_false') {
        const question = questions.find((q) => q.id === qId);
        const answer = newAnswers.find((a) => a.questionId === qId);
        if (question && answer) {
          const points = computeQuestionPoints(question, answer);
          const correctText = (question.options ?? [])
            .filter((option) => option.isCorrect)
            .map((option) => option.text)
            .join(', ');

          setFrozenAnswers((f) => ({ ...f, [qId]: { ...answer } }));
          setCheckedQuestions((c) => ({ ...c, [qId]: true }));
          setAnswerFeedback((f) => ({
            ...f,
            [qId]: points.isCorrect
              ? 'Răspuns corect!'
              : `Incorect. Răspunsul corect: ${correctText || 'nu este configurat'}.`,
          }));

          if (points.isCorrect) {
            setTimeout(() => {
              setCurQ((index) => {
                const qIdx = questions.findIndex((q) => q.id === qId);
                return qIdx === index ? Math.min(questions.length - 1, index + 1) : index;
              });
            }, 800);
          }
        }
      }

      return newAnswers;
    });
  }, [checkedQuestions, questions]);

  const verifyCurrentAnswer = useCallback(() => {
    if (!currentQuestion || currentQuestion.type === 'stepped' || checkedQuestions[currentQuestion.id]) return false;
    const answer = answers.find((item) => item.questionId === currentQuestion.id);
    if (!answer || answer.selectedOptionIds.length === 0) {
      setAnswerFeedback((prev) => ({ ...prev, [currentQuestion.id]: 'Alege un răspuns înainte de verificare.' }));
      return false;
    }

    const points = computeQuestionPoints(currentQuestion, answer);
    const correctText = (currentQuestion.options ?? [])
      .filter((option) => option.isCorrect)
      .map((option) => option.text)
      .join(', ');

    setFrozenAnswers((prev) => ({ ...prev, [currentQuestion.id]: { ...answer } }));
    setCheckedQuestions((prev) => ({ ...prev, [currentQuestion.id]: true }));
    setAnswerFeedback((prev) => ({
      ...prev,
      [currentQuestion.id]: points.isCorrect
        ? 'Răspuns corect. Întrebarea a fost blocată.'
        : `Răspuns greșit. Poți alege răspunsul corect acum pentru a reține informația. Răspuns corect: ${correctText || 'nu este configurat'}.`,
    }));
    return points.isCorrect;
  }, [answers, checkedQuestions, currentQuestion]);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;

    if (currentQuestion.type === 'stepped') {
      const steps = currentQuestion.steps ?? [];
      const resolved = steps.length > 0 && (stepIndexByQuestion[currentQuestion.id] ?? 0) >= steps.length;
      if (!resolved) {
        setAnswerFeedback((prev) => ({ ...prev, [currentQuestion.id]: 'Finalizează toate etapele înainte de a trece mai departe.' }));
        return;
      }
      setCurQ((index) => Math.min(questions.length - 1, index + 1));
      return;
    }

    if (!checkedQuestions[currentQuestion.id]) {
      const isCorrect = verifyCurrentAnswer();
      if (isCorrect) {
        // Auto-advance after a brief delay if correct
        setTimeout(() => {
          setCurQ((index) => Math.min(questions.length - 1, index + 1));
        }, 800);
      }
      return;
    }

    setCurQ((index) => Math.min(questions.length - 1, index + 1));
  }, [checkedQuestions, currentQuestion, questions.length, stepIndexByQuestion, verifyCurrentAnswer]);

  const submitCurrentStep = useCallback(async () => {
    if (!currentQuestion || currentQuestion.type !== 'stepped') return;

    const steps = currentQuestion.steps ?? [];
    const activeStepIndex = stepIndexByQuestion[currentQuestion.id] ?? 0;
    const activeStep = steps[activeStepIndex];
    if (!activeStep) return;

    const answerKey = `${currentQuestion.id}:${activeStep.id}`;
    const userAnswer = stepInputs[answerKey]?.trim() ?? '';
    if (!userAnswer) {
      setStepFeedback((prev) => ({ ...prev, [answerKey]: 'Introdu răspunsul pentru etapa curentă.' }));
      return;
    }

    const result = await ResultService.verifyStep(currentQuestion.id, activeStep.id, userAnswer);
    setAnswers((prev) => prev.map((answer) => {
      if (answer.questionId !== currentQuestion.id) return answer;
      return {
        ...answer,
        steppedPointsEarned: (answer.steppedPointsEarned ?? 0) + (result.isCorrect ? result.pointsEarned : 0),
        stepAnswers: { ...(answer.stepAnswers ?? {}), [activeStep.id]: userAnswer },
      };
    }));

    if (result.isCorrect) {
      setStepFeedback((prev) => ({ ...prev, [answerKey]: 'Corect.' }));
      setStepIndexByQuestion((prev) => ({
        ...prev,
        [currentQuestion.id]: Math.min(activeStepIndex + 1, steps.length),
      }));
      return;
    }

    const attempts = (stepAttempts[answerKey] ?? 0) + 1;
    setStepAttempts((prev) => ({ ...prev, [answerKey]: attempts }));
    setStepFeedback((prev) => ({
      ...prev,
      [answerKey]: attempts >= 2
        ? `Incorect. Răspuns corect: ${result.correctAnswer ?? activeStep.correctAnswer}`
        : 'Incorect. Mai ai o încercare.',
    }));

    if (attempts >= 2) {
      setStepIndexByQuestion((prev) => ({
        ...prev,
        [currentQuestion.id]: Math.min(activeStepIndex + 1, steps.length),
      }));
    }
  }, [currentQuestion, stepAttempts, stepIndexByQuestion, stepInputs]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error) return <div className="state-center state-error"><p>{error}</p><button className="btn btn-secondary" onClick={() => navigate('/teste')}>Înapoi</button></div>;
  if (!test) return <div className="state-center state-error"><p>Testul nu a fost găsit.</p></div>;

  if (phase === 'preview') {
    return (
      <div className="bac-preview">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 24 }} onClick={() => navigate('/teste')}>Înapoi</button>
        <div className="card text-center bac-preview__card">
          <span className="badge badge-amber">Simulare BAC</span>
          <h2>{test.title}</h2>
          <p className="text-muted">{test.description}</p>
          <div className="grid-stats">
            <div className="stat-card stat-card--teal"><div className="stat-card__value">{questions.length}</div><div className="stat-card__label">Itemi</div></div>
            <div className="stat-card stat-card--amber"><div className="stat-card__value">{test.duration}</div><div className="stat-card__label">Minute</div></div>
            <div className="stat-card stat-card--green"><div className="stat-card__value">{test.passingScore}%</div><div className="stat-card__label">Promovare</div></div>
          </div>
          <div className="bac-subject-grid">
            <div><strong>Subiectul I</strong><span>itemi obiectivi</span></div>
            <div><strong>Subiectul II</strong><span>itemi semiobiectivi</span></div>
            <div><strong>Subiectul III</strong><span>probleme pas cu pas</span></div>
          </div>
          {questions.length === 0
            ? <div className="alert alert-error">Testul nu are întrebări și nu poate fi susținut încă.</div>
            : <button className="btn btn-primary btn-lg" onClick={startTest}>Începe simularea</button>}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="state-center state-error"><p>Întrebarea curentă nu este disponibilă.</p></div>;
  }

  const curAns = answers.find((answer) => answer.questionId === currentQuestion.id);
  const currentSteps = currentQuestion.steps ?? [];
  const activeStepIndex = stepIndexByQuestion[currentQuestion.id] ?? 0;
  const activeStep = currentQuestion.type === 'stepped' ? currentSteps[activeStepIndex] : null;
  const activeStepKey = activeStep ? `${currentQuestion.id}:${activeStep.id}` : '';
  const currentFeedback = answerFeedback[currentQuestion.id];
  const currentResolved = isQuestionResolved(currentQuestion);
  const subjectQuestionCount = currentSubject === 'I'
    ? Math.min(10, questions.length)
    : currentSubject === 'II'
      ? Math.min(10, Math.max(questions.length - 10, 0))
      : Math.max(questions.length - 20, 0);

  return (
    <div className="bac-test-shell">
      <div className="bac-test-header">
        <div>
          <strong>{subjectTitle(currentSubject)}</strong>
          <span>Întrebarea {subjectLocalIndex(curQ)} din {subjectQuestionCount || 1}</span>
        </div>
        <div className="bac-test-header__stats">
          <span className="badge badge-neutral">Timp: {formatTime(remainingSeconds)}</span>
          <span className="badge badge-teal">Scor: {totalScore}/{totalMax}</span>
        </div>
      </div>

      <aside className="bac-subject-sidebar">
        {(['I', 'II', 'III'] as SubjectKey[]).map((subject) => (
          <button
            key={subject}
            className={subject === currentSubject ? 'is-active' : ''}
            onClick={() => setCurQ(subject === 'I' ? 0 : subject === 'II' ? Math.min(10, questions.length - 1) : Math.min(20, questions.length - 1))}
          >
            <strong>{subjectTitle(subject)}</strong>
            <span>{subjectStats[subject].answered}/{subjectStats[subject].total} verificate</span>
            <span>{subjectStats[subject].earned}/{subjectStats[subject].max} pct</span>
          </button>
        ))}
      </aside>

      <main className="bac-question-area">
        <div style={{ marginBottom: 16 }}>
          <div className="flex justify-between items-center mb-2 text-sm">
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
              Întrebarea {curQ + 1} din {questions.length}
            </span>
            <span style={{ color: 'var(--teal)', fontWeight: 700 }}>
              {Math.round(((curQ + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div style={{ height: 4, background: 'var(--bg-elevated)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              background: 'var(--teal)', 
              width: `${((curQ + 1) / questions.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        <div className="card bac-question-card">
          <div className="flex justify-between items-center mb-4">
            <span className="badge badge-teal">{subjectTitle(currentSubject)}</span>
            <span className="badge badge-amber">{computeQuestionPoints(currentQuestion, curAns).max} puncte</span>
          </div>
          <h3>{curQ + 1}. {currentQuestion.text}</h3>

          {currentQuestion.type === 'stepped' ? (
            <div className="stepped-answer">
              {currentSteps.length < 2 ? (
                <div className="alert alert-error">Întrebarea pe etape nu are minim două etape configurate.</div>
              ) : activeStep ? (
                <>
                  <div className="text-sm text-muted">Etapa {activeStepIndex + 1} din {currentSteps.length}</div>
                  <p>{activeStep.prompt}</p>
                  <div className="flex gap-2 items-center">
                    <input
                      className="form-input"
                      type={activeStep.stepType === 'numeric' ? 'number' : 'text'}
                      value={stepInputs[activeStepKey] ?? ''}
                      onChange={(e) => setStepInputs((prev) => ({ ...prev, [activeStepKey]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitCurrentStep(); }}
                      placeholder={activeStep.stepType === 'numeric' ? 'Răspuns numeric' : 'Scrie răspunsul și apasă Enter'}
                    />
                    {activeStep.unit && <span className="badge badge-neutral">{activeStep.unit}</span>}
                  </div>
                  {stepFeedback[activeStepKey] && (
                    <div className={`alert ${stepFeedback[activeStepKey].includes('Corect') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 8 }}>
                      {stepFeedback[activeStepKey]}
                    </div>
                  )}
                </>
              ) : (
                <div className="alert alert-success">Toate etapele au fost parcurse.</div>
              )}
            </div>
          ) : currentOptions.length === 0 ? (
            <div className="alert alert-error">Întrebarea nu are opțiuni configurate.</div>
          ) : (
            <div className={(currentQuestion.type === 'true-false' || currentQuestion.type === 'true_false') ? 'bac-options--tf' : 'bac-options'}>
              {currentOptions.map((option) => {
                const selected = curAns?.selectedOptionIds.includes(option.id) ?? false;
                const checked = Boolean(checkedQuestions[currentQuestion.id]);
                const isCorrectOption = checked && option.isCorrect;
                const isWrongSelection = checked && selected && !option.isCorrect;
                return (
                  <button
                    key={option.id}
                    className={[
                      selected ? 'is-selected' : '',
                      isCorrectOption ? 'is-correct-answer' : '',
                      isWrongSelection ? 'is-wrong-answer' : '',
                    ].filter(Boolean).join(' ')}
                    disabled={checked && curAns && (computeQuestionPoints(currentQuestion, curAns).isCorrect)}
                    onClick={() => toggleOption(currentQuestion.id, option.id, currentQuestion.type)}
                  >
                    <span>{isCorrectOption ? '✓' : isWrongSelection ? '×' : selected ? '•' : ''}</span>
                    {option.text}
                  </button>
                );
              })}
              {currentFeedback && (
                <div className={`alert ${currentFeedback.includes('corect') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: 8 }}>
                  {currentFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bac-navigation">
          <button className="btn btn-secondary" disabled={curQ === 0} onClick={() => setCurQ((index) => Math.max(0, index - 1))}>Anterior</button>
          {curQ < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={handleNext}>
              Următor
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={() => {
                if (!checkedQuestions[currentQuestion.id] && currentQuestion.type !== 'stepped') {
                  verifyCurrentAnswer();
                } else {
                  handleSubmit();
                }
              }} 
              disabled={phase === 'submitting' || (currentQuestion.type === 'stepped' && !isQuestionResolved(currentQuestion))}
            >
              {phase === 'submitting' ? 'Se trimite...' : 'Finalizează simularea'}
            </button>
          )}
        </div>

        <div className="bac-question-dots">
          {questions.map((question, index) => {
            const answered = question.type === 'stepped'
              ? (stepIndexByQuestion[question.id] ?? 0) >= (question.steps ?? []).length && (question.steps ?? []).length > 0
              : Boolean(checkedQuestions[question.id]);
            return (
              <button key={question.id} className={`${index === curQ ? 'is-active' : ''} ${answered ? 'is-answered' : ''}`} onClick={() => setCurQ(index)}>
                {index + 1}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
