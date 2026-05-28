export type QuestionType = 'single' | 'multiple' | 'true-false';

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
  explanation: string;
  points: number;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
}
