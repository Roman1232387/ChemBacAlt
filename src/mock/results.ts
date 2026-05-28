import type { Result } from '../models/Result';

export const mockResults: Result[] = [
  {
    id: 'r1',
    userId: 'u2',
    testId: 't1',
    score: 35,
    maxScore: 50,
    percentage: 70,
    passed: true,
    answers: [
      { questionId: 'q1-1', selectedOptionIds: ['q1-1-c'] },
      { questionId: 'q1-2', selectedOptionIds: ['q1-2-b'] },
      { questionId: 'q1-3', selectedOptionIds: ['q1-3-a', 'q1-3-b'] },
      { questionId: 'q1-4', selectedOptionIds: ['q1-4-t'] },
      { questionId: 'q1-5', selectedOptionIds: ['q1-5-b'] },
    ],
    questionResults: [
      { questionId: 'q1-1', userAnswerIds: ['q1-1-c'], isCorrect: true,  pointsEarned: 10, pointsAvailable: 10 },
      { questionId: 'q1-2', userAnswerIds: ['q1-2-b'], isCorrect: true,  pointsEarned: 10, pointsAvailable: 10 },
      { questionId: 'q1-3', userAnswerIds: ['q1-3-a', 'q1-3-b'], isCorrect: false, pointsEarned: 0, pointsAvailable: 15 },
      { questionId: 'q1-4', userAnswerIds: ['q1-4-t'], isCorrect: true,  pointsEarned: 5,  pointsAvailable: 5  },
      { questionId: 'q1-5', userAnswerIds: ['q1-5-b'], isCorrect: false, pointsEarned: 0,  pointsAvailable: 10 },
    ],
    startedAt: '2024-03-10T14:00:00Z',
    completedAt: '2024-03-10T14:22:00Z',
    duration: 1320,
  },
  {
    id: 'r2',
    userId: 'u2',
    testId: 't2',
    score: 40,
    maxScore: 40,
    percentage: 100,
    passed: true,
    answers: [
      { questionId: 'q2-1', selectedOptionIds: ['q2-1-b'] },
      { questionId: 'q2-2', selectedOptionIds: ['q2-2-c'] },
      { questionId: 'q2-3', selectedOptionIds: ['q2-3-t'] },
      { questionId: 'q2-4', selectedOptionIds: ['q2-4-a', 'q2-4-c'] },
    ],
    questionResults: [
      { questionId: 'q2-1', userAnswerIds: ['q2-1-b'], isCorrect: true, pointsEarned: 10, pointsAvailable: 10 },
      { questionId: 'q2-2', userAnswerIds: ['q2-2-c'], isCorrect: true, pointsEarned: 10, pointsAvailable: 10 },
      { questionId: 'q2-3', userAnswerIds: ['q2-3-t'], isCorrect: true, pointsEarned: 5,  pointsAvailable: 5  },
      { questionId: 'q2-4', userAnswerIds: ['q2-4-a', 'q2-4-c'], isCorrect: true, pointsEarned: 15, pointsAvailable: 15 },
    ],
    startedAt: '2024-03-11T10:00:00Z',
    completedAt: '2024-03-11T10:18:00Z',
    duration: 1080,
  },
];
