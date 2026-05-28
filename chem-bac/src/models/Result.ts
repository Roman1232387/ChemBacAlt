import type { UserAnswer } from './Question';

export interface QuestionResult {
  questionId: string;
  userAnswerIds: string[];
  isCorrect: boolean;
  pointsEarned: number;
  pointsAvailable: number;
}

export interface Result {
  id: string;
  userId: string;
  testId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  answers: UserAnswer[];
  questionResults: QuestionResult[];
  startedAt: string;
  completedAt: string;
  duration: number;
}
