export type LessonDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonCategory =
  | 'chimie-organica'
  | 'chimie-anorganica'
  | 'electrochimie'
  | 'termodinamica'
  | 'cinetica'
  | 'chimie-fizica';

export interface LessonSection {
  id: string;
  title: string;
  content: string;
  formula?: string;
}

export interface Lesson {
  id: string;
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

export const DIFFICULTY_LABELS: Record<LessonDifficulty, string> = {
  beginner: 'Initiere',
  intermediate: 'Mediu',
  advanced: 'Avansat',
};

export const CATEGORY_LABELS: Record<LessonCategory, string> = {
  'chimie-organica': 'Chimie Organica',
  'chimie-anorganica': 'Chimie Anorganica',
  electrochimie: 'Electrochimie',
  termodinamica: 'Termodinamica',
  cinetica: 'Cinetica',
  'chimie-fizica': 'Chimie Fizica',
};
