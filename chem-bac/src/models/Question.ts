export type QuestionType = 'single' | 'multiple' | 'true-false' | 'true_false' | 'stepped' | 'fill_blank';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  steps: QuestionStep[];
  explanation: string;
  points: number;
}

export interface QuestionStep {
  id: string;
  questionId?: string;
  order: number;
  prompt: string;
  correctAnswer: string;
  stepType: 'numeric' | 'text' | 'select';
  tolerance: number;
  points: number;
  unit?: string | null;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
  steppedPointsEarned?: number;
  stepAnswers?: Record<string, string>;
}
