import axiosInstance from './axiosInstance';
import type { Test, TestFormData } from '../models/Test';

const mapTest = (data: any): Test => ({
  id: String(data.id),
  title: data.title,
  description: data.description,
  lessonId: String(data.lessonId),
  duration: data.duration,
  passingScore: data.passingScore,
  status: data.status,
  createdBy: String(data.createdById),
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
  questions: (data.questions ?? []).map((q: any) => ({
    id: String(q.id),
    text: q.text,
    type: q.type,
    explanation: q.explanation,
    points: q.points,
    steps: (q.steps ?? []).map((s: any) => ({
      id: String(s.id),
      questionId: String(s.questionId ?? q.id),
      order: s.order,
      prompt: s.prompt,
      correctAnswer: s.correctAnswer,
      stepType: s.stepType,
      tolerance: s.tolerance,
      points: s.points,
      unit: s.unit ?? null,
    })),
    options: (q.options ?? []).map((o: any) => ({
      id: String(o.id),
      text: o.text,
      isCorrect: o.isCorrect,
    })),
  })),
});

const mapQuestionForApi = (question: Test['questions'][number]) => ({
  id: Number(question.id) || 0,
  text: question.text,
  type: question.type,
  explanation: question.explanation,
  points: question.points,
  steps: (question.steps ?? []).map((step, index) => ({
    id: Number(step.id) || 0,
    questionId: Number(question.id) || 0,
    order: step.order || index + 1,
    prompt: step.prompt,
    correctAnswer: step.correctAnswer,
    stepType: step.stepType,
    tolerance: step.tolerance,
    points: step.points,
    unit: step.unit ?? null,
  })),
  options: question.options.map((option) => ({
    id: Number(option.id) || 0,
    text: option.text,
    isCorrect: option.isCorrect,
  })),
});

const assertTestPayload = (data: any): void => {
  if (!data || typeof data.id === 'undefined' || !data.title || !data.status) {
    throw new Error(data?.message ?? 'Raspuns invalid de la server pentru test.');
  }
};

export const TestService = {
  async getAll(): Promise<Test[]> {
    const response = await axiosInstance.get('/test/getAll');
    return response.data.map(mapTest);
  },

  async getById(id: string): Promise<Test> {
    const response = await axiosInstance.get(`/test?id=${id}`);
    return mapTest(response.data);
  },

  async create(data: TestFormData, createdById: string): Promise<Test> {
    const response = await axiosInstance.post('/test', {
      id: 0,
      title: data.title,
      description: data.description,
      duration: data.duration,
      passingScore: data.passingScore,
      status: data.status,
      lessonId: Number(data.lessonId) || 0,
      createdById: Number(createdById) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: data.questions.map(mapQuestionForApi),
    });
    assertTestPayload(response.data);
    return mapTest(response.data);
  },

  async update(id: string, data: TestFormData): Promise<Test> {
    const response = await axiosInstance.put('/test', {
      id: Number(id),
      title: data.title,
      description: data.description,
      duration: data.duration,
      passingScore: data.passingScore,
      status: data.status,
      lessonId: Number(data.lessonId) || 0,
      createdById: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      questions: data.questions.map(mapQuestionForApi),
    });
    assertTestPayload(response.data);
    return mapTest(response.data);
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/test?id=${id}`);
  },
};
