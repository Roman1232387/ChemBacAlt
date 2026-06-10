export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonSectionType = 'text' | 'formula' | 'table' | 'image' | 'tip' | 'bac_attention' | 'warning';
export type LessonCategory =
  | 'chimie-generala'
  | 'chimie-organica'
  | 'chimie-anorganica'
  | 'calcule-chimice'
  | 'electrochimie'
  | 'termodinamica'
  | 'cinetica'
  | 'chimie-fizica';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  formula: string;
  order?: number;
  type: LessonSectionType;
  imageUrl?: string | null;
  tableJson?: string | null;
}

export interface Chapter {
  id: string;
  title: string;
  profile: 'general' | 'real' | 'umanist' | string;
  order: number;
}

export interface Lesson {
  id: string;
  chapterId?: string | null;
  title: string;
  category: LessonCategory;
  difficulty: LessonDifficulty;
  description: string;
  sections: LessonSection[];
  duration: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonFormData {
  chapterId?: string | null;
  title: string;
  category: LessonCategory;
  difficulty: LessonDifficulty;
  description: string;
  duration: number;
  sections: LessonSection[];
}

export const DIFFICULTY_LABELS: Record<LessonDifficulty, string> = {
  beginner: 'Inițiere',
  intermediate: 'Mediu',
  advanced: 'Avansat',
};

export const CATEGORY_LABELS: Record<LessonCategory, string> = {
  'chimie-generala': 'Chimie generală',
  'chimie-organica': 'Chimie organică',
  'chimie-anorganica': 'Chimie anorganică',
  'calcule-chimice': 'Calcule Chimice',
  electrochimie: 'Electrochimie',
  termodinamica: 'Termodinamica',
  cinetica: 'Cinetica',
  'chimie-fizica': 'Chimie fizică',
};
