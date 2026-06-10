import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ResultService } from '../services/ResultService';
import { TestService } from '../services/TestService';
import type { Result } from '../models/Result';
import type { Test } from '../models/Test';
import type { Question, UserAnswer } from '../models/Question';

type SubjectKey = 'I' | 'II' | 'III';

const subjectForIndex = (index: number): SubjectKey => index < 10 ? 'I' : index < 20 ? 'II' : 'III';
const subjectTitle = (subject: SubjectKey) => `Subiectul ${subject}`;

function getCorrectAnswer(question: Question) {
  if (question.type === 'stepped') {
    return (question.steps ?? [])
      .map((step, index) => `${index + 1}. ${step.correctAnswer}${step.unit ? ` ${step.unit}` : ''}`)
      .join('; ');
  }

  return (question.options ?? [])
    .filter((option) => option.isCorrect)
    .map((option) => option.text)
    .join(', ');
}

function getUserAnswer(question: Question, result: Result) {
  const storedAnswer = result.answers.find((answer) => answer.questionId === question.id) as UserAnswer | undefined;
  if (question.type === 'stepped') {
    const stepAnswers = storedAnswer?.stepAnswers ?? {};
    const values = (question.steps ?? []).map((step, index) => `${index + 1}. ${stepAnswers[step.id] ?? 'fără răspuns'}`);
    return values.join('; ');
  }

  const selectedIds = storedAnswer?.selectedOptionIds ?? result.questionResults.find((item) => item.questionId === question.id)?.userAnswerIds ?? [];
  const selected = (question.options ?? []).filter((option) => selectedIds.includes(option.id)).map((option) => option.text);
  return selected.length > 0 ? selected.join(', ') : 'fără răspuns';
}

export function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<Result | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testWarning, setTestWarning] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const submitted = sessionStorage.getItem('test_submitted');
    if (submitted === 'true') {
      setShowToast(true);
      sessionStorage.removeItem('test_submitted');
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setError('Id-ul rezultatului lipseste.');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      setTestWarning(null);
      try {
        const loadedResult = await ResultService.getById(id);
        setResult(loadedResult);

        try {
          setTest(await TestService.getById(loadedResult.testId));
        } catch {
          setTest(null);
          setTestWarning('Rezultatul există, dar testul asociat nu mai este disponibil.');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Rezultatul nu a fost găsit.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const subjectRows = useMemo(() => {
    if (!test || !result) return [];
    const rows: Record<SubjectKey, { subject: SubjectKey; earned: number; max: number; wrong: number }> = {
      I: { subject: 'I', earned: 0, max: 0, wrong: 0 },
      II: { subject: 'II', earned: 0, max: 0, wrong: 0 },
      III: { subject: 'III', earned: 0, max: 0, wrong: 0 },
    };

    test.questions.forEach((question, index) => {
      const subject = subjectForIndex(index);
      const qr = result.questionResults.find((item) => item.questionId === question.id);
      rows[subject].earned += qr?.pointsEarned ?? 0;
      rows[subject].max += qr?.pointsAvailable ?? question.points;
      if (qr && !qr.isCorrect) rows[subject].wrong += 1;
    });

    return [rows.I, rows.II, rows.III].filter((row) => row.max > 0);
  }, [result, test]);

  const questionRows = useMemo(() => {
    if (!test || !result) return [];
    return test.questions
      .map((question, index) => ({
        question,
        index,
        qr: result.questionResults.find((item) => item.questionId === question.id),
      }));
  }, [result, test]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (error) {
    return (
      <div className="state-center state-error">
        <p>{error}</p>
        <Link to="/rezultate" className="btn btn-secondary btn-sm">Înapoi la rezultate</Link>
      </div>
    );
  }
  if (!result) return <div className="state-center state-error"><p>Rezultatul nu a fost găsit.</p></div>;

  const color = result.percentage >= 80 ? 'var(--green)' : result.percentage >= 50 ? 'var(--amber)' : 'var(--red)';
  const mins = Math.floor(result.duration / 60);
  const secs = result.duration % 60;
  const testTitle = test?.title ?? `Test #${result.testId}`;
  const message = result.percentage < 50
    ? 'Mai ai de lucru! Recitește lecțiile și reia problemele pas cu pas.'
    : result.percentage < 70
      ? 'Progres bun! Continuă să exersezi, mai ales itemii unde ai pierdut puncte.'
      : 'Excelent! Ești pregătit pentru BAC, menține ritmul de recapitulare.';

  return (
    <div className="exam-result-page">
      {showToast && (
        <div className="alert alert-success" style={{
          position: 'fixed',
          top: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '12px 24px',
          borderRadius: 'var(--r-md)',
          animation: 'pageFadeIn 0.3s ease-out'
        }}>
          ✓ Testul a fost trimis cu succes!
        </div>
      )}
      <div className="flex gap-3 flex-wrap" style={{ marginBottom: 24 }}>
        <Link to="/rezultate" className="btn btn-ghost btn-sm">Înapoi la rezultate</Link>
        <Link to="/teste" className="btn btn-secondary btn-sm">Alte teste</Link>
      </div>

      {testWarning && <div className="alert alert-warning">{testWarning}</div>}

      <div className="card result-hero exam-result-hero">
        <div>
          <span className="badge badge-amber">Rezultat Simulare BAC</span>
          <h2>{testTitle}</h2>
          <p className="text-muted">Timp de lucru: {mins}m {secs}s</p>
        </div>
        <div className="exam-result-score" style={{ color }}>
          {result.percentage}%
          <span>{result.score}/{result.maxScore} puncte</span>
        </div>
      </div>

      <div className="card exam-message">
        <strong>{result.passed ? 'Promovat' : 'Nepromovat'}</strong>
        <p>{message}</p>
      </div>

      {test && (
        <>
          <div className="table-wrap" style={{ marginBottom: 24 }}>
            <table>
              <thead>
                <tr>
                  <th>Subiect</th>
                  <th>Scor</th>
                  <th>Procent</th>
                  <th>Întrebări greșite</th>
                </tr>
              </thead>
              <tbody>
                {subjectRows.map((row) => (
                  <tr key={row.subject}>
                    <td className="font-bold">{subjectTitle(row.subject)}</td>
                    <td className="font-mono">{row.earned}/{row.max}</td>
                    <td>{row.max > 0 ? Math.round((row.earned / row.max) * 100) : 0}%</td>
                    <td>{row.wrong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ marginBottom: 16 }}>Analiza întrebărilor</h3>
          {questionRows.length === 0 ? (
            <div className="card">
              <p className="text-muted">Nu există detalii salvate pentru întrebări.</p>
            </div>
          ) : (
            questionRows.map(({ question, index, qr }) => {
              const isCorrect = Boolean(qr?.isCorrect);
              return (
              <div key={question.id} className={`card exam-wrong-card ${isCorrect ? 'exam-question-card--correct' : ''}`}>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className={`badge badge-${isCorrect ? 'green' : 'red'}`}>
                    {isCorrect ? 'Corect' : 'Greșit'} · {subjectTitle(subjectForIndex(index))}
                  </span>
                  <span className="font-mono text-sm">{qr?.pointsEarned ?? 0}/{qr?.pointsAvailable ?? question.points} pct</span>
                </div>
                <h4>{index + 1}. {question.text}</h4>
                <div className="exam-answer-grid">
                  <div className={`exam-answer ${isCorrect ? 'exam-answer--correct' : 'exam-answer--wrong'}`}>
                    <strong>Răspunsul elevului</strong>
                    <span>{getUserAnswer(question, result)}</span>
                  </div>
                  <div className="exam-answer exam-answer--correct">
                    <strong>Răspuns corect</strong>
                    <span>{getCorrectAnswer(question)}</span>
                  </div>
                </div>
                {question.explanation && (
                  <div className="exam-explanation">
                    <strong>Explicație:</strong> {question.explanation}
                  </div>
                )}
              </div>
            );
            })
          )}
        </>
      )}
    </div>
  );
}
