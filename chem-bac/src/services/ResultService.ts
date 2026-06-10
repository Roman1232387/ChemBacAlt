import axiosInstance from './axiosInstance';
import type { Result, QuestionResult } from '../models/Result';
import type { UserAnswer } from '../models/Question';
import type { Test } from '../models/Test';

const mapResult = (data: any): Result => ({
  id: String(data.id),
  userId: String(data.userId),
  testId: String(data.testId),
  score: data.score,
  maxScore: data.maxScore,
  percentage: data.percentage,
  passed: data.passed,
  answers: JSON.parse(data.answersJson || '[]'),
  questionResults: JSON.parse(data.questionResultsJson || '[]'),
  startedAt: data.startedAt,
  completedAt: data.completedAt,
  duration: data.duration,
});

export const ResultService = {
  async getByUser(userId: string): Promise<Result[]> {
    const response = await axiosInstance.get(`/result/getByUser?userId=${userId}`);
    return response.data.map(mapResult);
  },

  async getAll(): Promise<Result[]> {
    const response = await axiosInstance.get('/result/all');
    return response.data.map(mapResult);
  },

  async getById(id: string): Promise<Result> {
    const response = await axiosInstance.get(`/result?id=${id}`);
    return mapResult(response.data);
  },

  async submit(userId: string, test: Test, answers: UserAnswer[], startedAt: string): Promise<Result> {
    const questionResults: QuestionResult[] = test.questions.map((q) => {
      const userAnswer = answers.find((a) => a.questionId === q.id);
      const userIds = userAnswer?.selectedOptionIds ?? [];
      const correctIds = (q.options ?? []).filter((o) => o.isCorrect).map((o) => o.id);
      let isCorrect = false;
      if (q.type === 'stepped') {
        const pointsAvailable = (q.steps ?? []).reduce((acc, step) => acc + step.points, 0) || q.points;
        const pointsEarned = userAnswer?.steppedPointsEarned ?? 0;
        return {
          questionId: q.id,
          userAnswerIds: [],
          isCorrect: pointsEarned === pointsAvailable,
          pointsEarned,
          pointsAvailable,
        };
      }
      if (q.type === 'single' || q.type === 'true-false' || q.type === 'true_false') {
        isCorrect = userIds.length === 1 && correctIds.includes(userIds[0]);
      } else {
        isCorrect = userIds.length === correctIds.length && correctIds.every((cid) => userIds.includes(cid));
      }
      return {
        questionId: q.id,
        userAnswerIds: userIds,
        isCorrect,
        pointsEarned: isCorrect ? q.points : 0,
        pointsAvailable: q.points,
      };
    });

    const score = questionResults.reduce((acc, r) => acc + r.pointsEarned, 0);
    const maxScore = questionResults.reduce((acc, r) => acc + r.pointsAvailable, 0);
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const completedAt = new Date().toISOString();
    const duration = Math.round((new Date(completedAt).getTime() - new Date(startedAt).getTime()) / 1000);

    const response = await axiosInstance.post('/result', {
      id: 0,
      userId: Number(userId) || 0,
      testId: Number(test.id) || 0,
      score,
      maxScore,
      percentage,
      passed: percentage >= test.passingScore,
      answersJson: JSON.stringify(answers),
      questionResultsJson: JSON.stringify(questionResults),
      startedAt,
      completedAt,
      duration,
    });

    if (!response.data.isSuccess) throw new Error(response.data.message);
    if (typeof response.data.id === 'undefined' || response.data.id === null) {
      throw new Error('Serverul nu a returnat id-ul rezultatului salvat.');
    }

    return {
      id: String(response.data.id),
      userId,
      testId: test.id,
      score,
      maxScore,
      percentage,
      passed: percentage >= test.passingScore,
      answers,
      questionResults,
      startedAt,
      completedAt,
      duration,
    };
  },

  async verifyStep(questionId: string, stepId: string, userAnswer: string): Promise<{ isCorrect: boolean; correctAnswer?: string; pointsEarned: number }> {
    const response = await axiosInstance.post('/result/verify-step', {
      questionId: Number(questionId),
      stepId: Number(stepId),
      userAnswer,
    });
    return response.data;
  },
};
