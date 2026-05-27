import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TOPIC_CATEGORY_LABELS, TOPIC_DIFF_LABELS } from '../models/Topic';
import type { Topic, TopicCategory, TopicDifficulty } from '../models/Topic';

const topics: Topic[] = [
    {
        id: 'top1',
        title: 'Structura Atomului',
        category: 'structura-atomului',
        difficulty: 'beginner',
        icon: 'A',
        shortDescription: 'Nucleu, electroni, configuratie electronica si proprietati periodice.',
        relatedLessonIds: [],
        keyPoints: ['Atomul contine protoni, neutroni si electroni.', 'Z indica numarul de protoni.'],
        commonMistakes: ['Confundarea numarului atomic cu numarul de masa.'],
        examTips: ['Verifica intotdeauna suma electronilor cu Z.'],
        subsections: [{ id: 'top1-1', title: 'Nucleul atomic', content: 'Nucleul contine protoni si neutroni.', formulas: [{ label: 'Numar de masa', formula: 'A = Z + N' }] }],
    },
    {
        id: 'top2',
        title: 'Legaturi Chimice',
        category: 'chimie-anorganica',
        difficulty: 'intermediate',
        icon: 'L',
        shortDescription: 'Legatura ionica, covalenta si metalica.',
        relatedLessonIds: [],
        keyPoints: ['Legatura ionica presupune transfer de electroni.', 'Legatura covalenta presupune punere in comun.'],
        commonMistakes: ['Confundarea legaturii ionice cu cea covalent-polara.'],
        examTips: ['Foloseste diferenta de electronegativitate pentru clasificare.'],
        subsections: [{ id: 'top2-1', title: 'Legatura ionica', content: 'Apare intre metale si nemetale prin transfer de electroni.' }],
    },
    {
        id: 'top3',
        title: 'Reactii Redox',
        category: 'chimie-anorganica',
        difficulty: 'intermediate',
        icon: 'R',
        shortDescription: 'Transfer de electroni, numere de oxidare si bilant electronic.',
        relatedLessonIds: ['l1'],
        keyPoints: ['Oxidarea inseamna pierdere de electroni.', 'Reducerea inseamna castig de electroni.'],
        commonMistakes: ['Inversarea oxidantului cu reducatorul.'],
        examTips: ['Egalizeaza electronii cedati cu cei acceptati.'],
        subsections: [{ id: 'top3-1', title: 'Numarul de oxidare', content: 'Numarul de oxidare ajuta la identificarea proceselor redox.' }],
    },
    {
        id: 'top4',
        title: 'Acizi si Baze',
        category: 'chimie-anorganica',
        difficulty: 'beginner',
        icon: 'pH',
        shortDescription: 'Teoria Bronsted-Lowry, pH, neutralizare si indicatori.',
        relatedLessonIds: ['l2'],
        keyPoints: ['Acidul doneaza protoni.', 'Baza accepta protoni.', 'pH = -log[H3O+].'],
        commonMistakes: ['Calculul pH-ului fara semnul minus.'],
        examTips: ['pH sub 7 este acid, peste 7 este bazic.'],
        subsections: [{ id: 'top4-1', title: 'Calculul pH-ului', content: 'pH-ul masoara concentratia ionilor hidroniu.', formulas: [{ label: 'pH', formula: 'pH = -log[H3O+]' }] }],
    },
    {
        id: 'top5',
        title: 'Hidrocarburi',
        category: 'chimie-organica',
        difficulty: 'intermediate',
        icon: 'C',
        shortDescription: 'Alcani, alchene si alchine: nomenclatura, proprietati si reactii.',
        relatedLessonIds: ['l3'],
        keyPoints: ['Alcanii dau substitutie.', 'Alchenele dau aditie.', 'Alchinele contin tripla legatura.'],
        commonMistakes: ['Confundarea formulelor generale.'],
        examTips: ['Identifica mai intai catena principala.'],
        subsections: [{ id: 'top5-1', title: 'Alcani', content: 'Alcanii sunt hidrocarburi saturate.', formulas: [{ label: 'Formula', formula: 'CnH2n+2' }] }],
    },
    {
        id: 'top6',
        title: 'Echilibrul Chimic',
        category: 'chimie-anorganica',
        difficulty: 'advanced',
        icon: 'K',
        shortDescription: 'Constanta de echilibru si principiul Le Chatelier.',
        relatedLessonIds: [],
        keyPoints: ['Echilibrul chimic este dinamic.', 'Kc depinde de temperatura.'],
        commonMistakes: ['Includerea solidelor pure in Kc.'],
        examTips: ['Catalizatorul nu modifica pozitia echilibrului.'],
        subsections: [{ id: 'top6-1', title: 'Constanta Kc', content: 'Kc exprima raportul concentratiilor la echilibru.' }],
    },
    {
        id: 'top7',
        title: 'Compusi Organici cu Functiuni',
        category: 'chimie-organica',
        difficulty: 'advanced',
        icon: 'F',
        shortDescription: 'Alcooli, acizi carboxilici, esteri, amine si aminoacizi.',
        relatedLessonIds: [],
        keyPoints: ['Alcoolii contin grupa -OH.', 'Acizii carboxilici contin grupa -COOH.'],
        commonMistakes: ['Confundarea alcoolilor primari cu cei secundari la oxidare.'],
        examTips: ['Esterificarea produce ester si apa.'],
        subsections: [{ id: 'top7-1', title: 'Alcooli', content: 'Alcoolii reactioneaza prin esterificare, deshidratare si oxidare.' }],
    },
];

export function TopicsPage() {
    const [search, setSearch] = useState('');
    const [filterCat, setFilterCat] = useState<TopicCategory | ''>('');
    const [filterDiff, setFilterDiff] = useState<TopicDifficulty | ''>('');

    const filtered = useMemo(() => {
        let list = [...topics];
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
                        {filtered.length} din {topics.length} teme · Explicații detaliate, formule și sfaturi pentru examen
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
