import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ResultService } from '../services/ResultService';
import { TestService }   from '../services/TestService';
import type { Result } from '../models/Result';
import type { Test }   from '../models/Test';

export function ResultDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [result,  setResult]  = useState<Result | null>(null);
  const [test,    setTest]    = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const r = await ResultService.getById(id);
        setResult(r);
        setTest(await TestService.getById(r.testId));
      } finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <div className="state-center"><div className="spinner" /></div>;
  if (!result || !test) return <div className="state-center state-error"><p>Rezultatul nu a fost gasit.</p></div>;

  const color = result.percentage >= 80 ? 'var(--green)' : result.percentage >= 60 ? 'var(--amber)' : 'var(--red)';
  const mins  = Math.floor(result.duration / 60);
  const secs  = result.duration % 60;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="flex gap-3 flex-wrap" style={{ marginBottom: 24 }}>
        <Link to="/rezultate" className="btn btn-ghost btn-sm">← Rezultatele mele</Link>
        <Link to="/teste"     className="btn btn-secondary btn-sm">◉ Alte teste</Link>
      </div>

      {/* Score hero */}
      <div className="card text-center" style={{
        padding: '48px 32px', marginBottom: 24,
        background: `linear-gradient(135deg,var(--bg-surface),${result.passed ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)'})`,
        border: `1px solid ${result.passed ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)'}`,
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: 8 }}>{result.passed ? '🏆' : '📖'}</div>
        <div style={{ fontSize: '4rem', fontFamily: 'var(--font-display)', fontWeight: 900, color, lineHeight: 1 }}>
          {result.percentage}%
        </div>
        <p className="text-muted" style={{ marginTop: 6 }}>{result.score} din {result.maxScore} puncte</p>
        <div style={{ marginTop: 16 }}>
          <span className={`badge badge-${result.passed ? 'green' : 'red'}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
            {result.passed ? '✓ PROMOVAT' : '✗ NEPROMOVAT'}
          </span>
        </div>
        <p className="text-muted text-sm" style={{ marginTop: 12 }}>
          {test.title} &middot; Timp: {mins}m {secs}s
        </p>
      </div>

      {/* Question review */}
      <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>Detalii pe intrebari</h3>
      {test.questions.map((q, i) => {
        const qr = result.questionResults.find((r) => r.questionId === q.id);
        return (
          <div key={q.id} className="card" style={{ marginBottom: 12, borderColor: qr?.isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.25)' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: 10 }}>
              <span className="text-sm text-muted">Intrebarea {i + 1}</span>
              <div className="flex gap-2 items-center">
                <span className="font-mono text-sm" style={{ color: qr?.isCorrect ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                  {qr?.pointsEarned}/{qr?.pointsAvailable} pct
                </span>
                <span className={`badge badge-${qr?.isCorrect ? 'green' : 'red'}`}>{qr?.isCorrect ? '✓' : '✗'}</span>
              </div>
            </div>
            <p className="font-bold" style={{ marginBottom: 12, lineHeight: 1.45 }}>{q.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt) => {
                const userSel = qr?.userAnswerIds.includes(opt.id);
                const isOk    = opt.isCorrect;
                const bg  = isOk ? 'var(--green-dim)' : userSel ? 'var(--red-dim)' : 'var(--bg-elevated)';
                const clr = isOk ? 'var(--green)'    : userSel ? 'var(--red)'     : 'var(--text-secondary)';
                const brd = isOk ? 'rgba(34,197,94,0.3)' : userSel ? 'rgba(239,68,68,0.3)' : 'var(--border)';
                return (
                  <div key={opt.id} style={{ background: bg, border: `1px solid ${brd}`, borderRadius: 'var(--r-md)', padding: '10px 14px', color: clr, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{isOk ? '✓' : userSel ? '✗' : '○'}</span>
                    <span style={{ flex: 1 }}>{opt.text}</span>
                    {userSel && <span style={{ fontSize: '0.72rem', opacity: 0.7 }}>Raspunsul tau</span>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', padding: '10px 14px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--teal)' }}>
              <span className="text-teal font-bold">Explicatie: </span>{q.explanation}
            </div>
          </div>
        );
      })}
    </div>
  );
}
