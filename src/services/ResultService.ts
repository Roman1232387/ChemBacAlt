import type { Result } from '../models/Result';
import type { UserAnswer } from '../models/Question';
import type { Test } from '../models/Test';
import { mockResults } from '../mock/results';

import { delay, mayFail } from './ApiUtils';

let store: Result[] = [...mockResults];
let nextId = 10;

export const ResultService = {
  async getByUser(userId: string): Promise<Result[]> {
    await delay(600);
    mayFail();
    return store.filter((r) => r.userId === userId);
  },

  async getById(id: string): Promise<Result> {
    await delay(400);
    const result = store.find((r) => r.id === id);
    if (!result) throw new Error('Rezultatul nu a fost gasit.');
    return { ...result };
  },

  async submit(userId: string, test: Test, answers: UserAnswer[], startedAt: string): Promise<Result> {
    await delay(900);
    mayFail();

    const questionResults = test.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      const userIds = userAnswer?.selectedOptionIds ?? [];
      const correctIds = q.options.filter((o) => o.isCorrect).map((o) => o.id);
      let isCorrect = false;
      if (q.type === 'single' || q.type === 'true-false') {
        isCorrect = userIds.length === 1 && correctIds.includes(userIds[0]);
      } else {
        isCorrect = userIds.length === correctIds.length && correctIds.every((cid) => userIds.includes(cid));
      }
      return { questionId: q.id, userAnswerIds: userIds, isCorrect, pointsEarned: isCorrect ? q.points : 0, pointsAvailable: q.points };
    });

    const score = questionResults.reduce((acc, r) => acc + r.pointsEarned, 0);
    const maxScore = questionResults.reduce((acc, r) => acc + r.pointsAvailable, 0);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const completedAt = new Date().toISOString();
    const duration = Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000);

    const result: Result = {
      id: `r${++nextId}`, userId, testId: test.id, score, maxScore, percentage,
      passed: percentage >= test.passingScore, answers, questionResults, startedAt, completedAt, duration,
    };
    store = [...store, result];
    return { ...result };
  },
};
