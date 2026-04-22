import axiosInstance from './axiosInstance';
import type { Test } from '../models/Test';

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
    options: (q.options ?? []).map((o: any) => ({
      id: String(o.id),
      text: o.text,
      isCorrect: o.isCorrect,
    })),
  })),
});

export const TestService = {
  async getAll(): Promise<Test[]> {
    const response = await axiosInstance.get('/test/getAll');
    return response.data.map(mapTest);
  },

  async getById(id: string): Promise<Test> {
    const response = await axiosInstance.get(`/test?id=${id}`);
    return mapTest(response.data);
  },
};