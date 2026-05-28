import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockTopics } from '../mock/topics';
import { TOPIC_CATEGORY_LABELS, TOPIC_DIFF_LABELS } from '../models/Topic';
import type { TopicCategory, TopicDifficulty } from '../models/Topic';

export function TopicsPage() {
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState<TopicCategory | ''>('');
    const [filterDiff, setFilterDiff] = useState<TopicDifficulty | ''>('');

    const filtered = useMemo(() => {
        let list = [...mockTopics];
        if (search) {
            const q = search.toLowerCase();
            list = list.filter(
                (t) => t.title.toLowerCase().includes(q) || t.shortDescription.toLowerCase().includes(q)
            );
        }
        if (filterCat) list = list.filter((t) => t.category === filterCat);
        if (filterDiff) list = list.filter((t) => t.difficulty === filterDiff);
        return list;
    }, [search, filterCat, filterDiff]);

    const diffBadge: Record<TopicDifficulty, string> = {
        beginner: 'badge-teal',
        intermediate: 'badge-amber',
        advanced: 'badge-red',
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div className="page-header__left">
                    <h2>Teme BAC Chimie</h2>
                    <p className="page-header__subtitle">
                        {filtered.length} din {mockTopics.length} teme · Explicații detaliate, formule și sfaturi pentru examen
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="search-input-wrap">
                    <span className="search-icon">⌕</span>
                    <input
                        className="form-input"
                        placeholder="Caută teme..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="form-input"
                    style={{ width: 'auto', minWidth: 180 }}
                    value={filterCat}
                    onChange={(e) => setFilterCat(e.target.value as TopicCategory | '')}
                >
                    <option value="">Orice categorie</option>
                    {Object.entries(TOPIC_CATEGORY_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                    ))}
                </select>
                <select
                    className="form-input"
                    style={{ width: 'auto', minWidth: 150 }}
                    value={filterDiff}
                    onChange={(e) => setFilterDiff(e.target.value as TopicDifficulty | '')}
                >
                    <option value="">Orice nivel</option>
                    <option value="beginner">Inițiere</option>
                    <option value="intermediate">Mediu</option>
                    <option value="advanced">Avansat</option>
                </select>
                {(search || filterCat || filterDiff) && (
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => { setSearch(''); setFilterCat(''); setFilterDiff(''); }}
                    >
                        ✕ Resetează
                    </button>
                )}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">📚</div>
                    <p className="empty-state__title">Nicio temă găsită pentru filtrele selectate.</p>
                </div>
            )}

            {/* Topics Grid */}
            <div className="grid-2">
                {filtered.map((topic) => (
                    <Link
                        key={topic.id}
                        to={`/teme/${topic.id}`}
                        className="card card--link topics-card"
                        style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}
                    >
                        {/* Top row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                            <div style={{
                                fontSize: '2.2rem', lineHeight: 1,
                                background: 'var(--teal-dim)',
                                border: '1px solid rgba(0,212,170,0.2)',
                                borderRadius: 'var(--r-md)',
                                width: 52, height: 52,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                {topic.icon}
                            </div>
                            <span className={`badge ${diffBadge[topic.difficulty]}`}>
                {TOPIC_DIFF_LABELS[topic.difficulty]}
              </span>
                        </div>

                        {/* Title + desc */}
                        <div>
                            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', marginBottom: 6 }}>
                                {topic.title}
                            </h4>
                            <p className="text-sm text-muted" style={{ lineHeight: 1.55 }}>
                                {topic.shortDescription}
                            </p>
                        </div>

                        {/* Key points preview */}
                        <div style={{
                            background: 'var(--bg-elevated)',
                            borderRadius: 'var(--r-md)',
                            padding: '10px 14px',
                            display: 'flex', flexDirection: 'column', gap: 6,
                        }}>
                            {topic.keyPoints.slice(0, 2).map((kp, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <span style={{ color: 'var(--teal)', flexShrink: 0, fontSize: '0.8rem', marginTop: 2 }}>◆</span>
                                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{kp}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                            <span className="badge badge-neutral">{TOPIC_CATEGORY_LABELS[topic.category]}</span>
                            <span style={{ color: 'var(--teal)', fontSize: '0.85rem', fontWeight: 700 }}>
                {topic.subsections.length} secțiuni →
              </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
