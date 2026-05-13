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
      questions: [],
    });
    return response.data;
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
      questions: [],
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/test?id=${id}`);
  },
};