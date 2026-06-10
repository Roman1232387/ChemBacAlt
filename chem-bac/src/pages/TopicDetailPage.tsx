import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TOPIC_CATEGORY_LABELS, TOPIC_DIFF_LABELS } from '../models/Topic';
import type { TopicDifficulty } from '../models/Topic';
import { TOPICS } from '../models/TopicData';

const diffBadge: Record<TopicDifficulty, string> = {
    beginner: 'badge-teal',
    intermediate: 'badge-amber',
    advanced: 'badge-red',
};

export function TopicDetailPage() {
    const { id } = useParams<{ id: string }>();
    const topic = TOPICS.find((t) => t.id === id);
    const [openSection, setOpenSection] = useState<string | null>(
        topic?.subsections[0]?.id ?? null
    );

    if (!topic) {
        return (
            <div className="error-state">
                <p>Tema nu a fost găsită.</p>
                <Link to="/teme" className="btn btn-secondary btn-sm">← Înapoi la teme</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <Link to="/teme" className="btn btn-ghost btn-sm" style={{ marginBottom: 24, display: 'inline-flex' }}>
                ← Înapoi la teme
            </Link>

            {/* Hero */}
            <div className="card" style={{
                marginBottom: 24,
                background: 'linear-gradient(135deg, var(--bg-surface), rgba(0,212,170,0.04))',
                borderColor: 'var(--border-active)',
            }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{
                        fontSize: '3rem', lineHeight: 1,
                        background: 'var(--teal-dim)',
                        border: '1px solid rgba(0,212,170,0.3)',
                        borderRadius: 'var(--r-lg)',
                        width: 72, height: 72,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>
                        {topic.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                            <span className={`badge ${diffBadge[topic.difficulty]}`}>{TOPIC_DIFF_LABELS[topic.difficulty]}</span>
                            <span className="badge badge-neutral">{TOPIC_CATEGORY_LABELS[topic.category]}</span>
                            <span className="badge badge-neutral">⏱ {topic.estimatedTime} min</span>
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>{topic.title}</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{topic.shortDescription}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                {/* Key Points */}
                <div className="card">
                    <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 12, color: 'var(--teal)' }}>
                        ◆ Idei cheie
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {topic.keyPoints.map((kp, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                    background: 'var(--teal-dim)', color: 'var(--teal)',
                    borderRadius: '50%', width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 900, flexShrink: 0, marginTop: 2,
                    fontFamily: 'var(--font-mono)',
                }}>
                  {i + 1}
                </span>
                                <span style={{ fontSize: '0.87rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{kp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Exam Tips */}
                    <div className="card" style={{ borderColor: 'rgba(0,212,170,0.3)', background: 'rgba(0,212,170,0.03)' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 10, color: 'var(--teal)' }}>
                            ✅ Sfaturi BAC
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {topic.examTips.map((tip, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', gap: 10 }}>
                                    <span style={{ color: 'var(--teal)', flexShrink: 0, fontWeight: 'bold' }}>✓</span>
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Common Mistakes */}
                    <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.03)' }}>
                        <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 10, color: 'var(--red)' }}>
                            ❌ Greșeli frecvente
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {topic.commonMistakes.map((m, i) => (
                                <div key={i} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', gap: 10 }}>
                                    <span style={{ color: 'var(--red)', flexShrink: 0, fontWeight: 'bold' }}>✗</span>
                                    {m}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Formulas */}
            {topic.keyFormulas.length > 0 && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 16, color: 'var(--teal)' }}>
                        📐 Formule Cheie
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                        {topic.keyFormulas.map((f, i) => (
                            <div key={i} style={{ 
                                background: 'var(--bg-elevated)', 
                                padding: '12px 16px', 
                                borderRadius: 'var(--r-md)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1rem',
                                color: 'var(--text-primary)',
                                textAlign: 'center',
                                border: '1px solid var(--border)'
                            }}>
                                {f}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Practice Problems */}
            {topic.practiceProblems.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                        📝 Probleme Rezolvate
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {topic.practiceProblems.map((p, i) => (
                            <details key={i} className="admin-accordion" style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                                <summary style={{ padding: '16px', cursor: 'pointer', fontWeight: 700, background: 'var(--bg-elevated)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span>{p.title}</span>
                                    <span style={{ color: 'var(--teal)', fontSize: '0.8rem' }}>Vezi rezolvarea ▼</span>
                                </summary>
                                <div style={{ padding: '20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.05em' }}>Pași:</div>
                                        <ol style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            {p.steps.map((step, si) => <li key={si} style={{ marginBottom: 4 }}>{step}</li>)}
                                        </ol>
                                    </div>
                                    <div style={{ 
                                        padding: '12px 16px', 
                                        background: 'rgba(0,212,170,0.05)', 
                                        borderLeft: '4px solid var(--teal)',
                                        borderRadius: '0 var(--r-sm) var(--r-sm) 0'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', marginBottom: 4 }}>Soluție:</div>
                                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{p.solution}</div>
                                    </div>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            )}

            {/* Accordion Subsections */}
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
                Conținut detaliat
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topic.subsections.map((sec, idx) => {
                    const isOpen = openSection === sec.id;
                    return (
                        <div
                            key={sec.id}
                            className="card"
                            style={{
                                padding: 0,
                                borderColor: isOpen ? 'var(--border-active)' : 'var(--border)',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => setOpenSection(isOpen ? null : sec.id)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '16px 20px', background: 'transparent', border: 'none',
                                    cursor: 'pointer', textAlign: 'left',
                                    color: 'var(--text-primary)',
                                }}
                            >
                <span style={{
                    width: 28, height: 28,
                    background: isOpen ? 'var(--teal)' : 'var(--bg-elevated)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 900,
                    color: isOpen ? 'var(--bg-base)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)', flexShrink: 0,
                    transition: 'all 0.2s ease',
                }}>
                  {idx + 1}
                </span>
                                <span style={{ flex: 1, fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                  {sec.title}
                </span>
                                <span style={{ color: 'var(--teal)', fontSize: '0.85rem', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  ▾
                </span>
                            </button>

                            {/* Accordion Body */}
                            {isOpen && (
                                <div style={{ padding: '0 20px 20px' }}>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: sec.formulas ? 16 : 0 }}>
                                        {sec.content}
                                    </p>

                                    {sec.formulas && sec.formulas.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                                            {sec.formulas.map((f, fi) => (
                                                <div key={fi} style={{
                                                    background: 'var(--bg-elevated)',
                                                    borderLeft: '3px solid var(--teal)',
                                                    borderRadius: 'var(--r-md)',
                                                    padding: '10px 14px',
                                                    display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap',
                                                }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, flexShrink: 0 }}>
                            {f.label}:
                          </span>
                                                    <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)', fontSize: '0.9rem' }}>
                                                        {f.formula}
                                                    </code>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {sec.tip && (
                                        <div style={{
                                            marginTop: 14,
                                            background: 'rgba(245,158,11,0.08)',
                                            border: '1px solid rgba(245,158,11,0.25)',
                                            borderRadius: 'var(--r-md)',
                                            padding: '10px 14px',
                                            fontSize: '0.85rem',
                                            color: 'var(--amber)',
                                            display: 'flex', gap: 8,
                                        }}>
                                            <span>💡</span>
                                            <span>{sec.tip}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Related lesson link */}
            {topic.relatedLessonIds.length > 0 && (
                <div className="card" style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: 2 }}>Lecție asociată</div>
                        <div className="text-sm text-muted">Aprofundează această temă cu lecția corespunzătoare</div>
                    </div>
                    <Link to={`/lectii/${topic.relatedLessonIds[0]}`} className="btn btn-primary btn-sm">
                        ◈ Mergi la lecție →
                    </Link>
                </div>
            )}
        </div>
    );
}
