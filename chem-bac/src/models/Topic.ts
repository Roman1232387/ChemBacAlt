export type TopicCategory = 'chimie-anorganica' | 'chimie-organica' | 'electrochimie' | 'termodinamica' | 'structura-atomului';
export type TopicDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface TopicFormula {
    label: string;
    formula: string;
}

export interface TopicSubsection {
    id: string;
    title: string;
    content: string;
    formulas?: TopicFormula[];
    tip?: string;
}

export interface PracticeProblem {
    title: string;
    steps: string[];
    solution: string;
}

export interface Topic {
    id: string;
    title: string;
    category: TopicCategory;
    difficulty: TopicDifficulty;
    shortDescription: string;
    icon: string;
    subsections: TopicSubsection[];
    keyPoints: string[];
    commonMistakes: string[];
    examTips: string[];
    relatedLessonIds: string[];
    estimatedTime: number;
    keyFormulas: string[];
    concepts: string[];
    practiceProblems: PracticeProblem[];
}

export const TOPIC_CATEGORY_LABELS: Record<TopicCategory, string> = {
    'chimie-anorganica': 'Chimie Anorganică',
    'chimie-organica': 'Chimie Organică',
    'electrochimie': 'Electrochimie',
    'termodinamica': 'Termodinamică',
    'structura-atomului': 'Structura Atomului',
};

export const TOPIC_DIFF_LABELS: Record<TopicDifficulty, string> = {
    beginner: 'Inițiere',
    intermediate: 'Mediu',
    advanced: 'Avansat',
};