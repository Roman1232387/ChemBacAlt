import axiosInstance from './axiosInstance';
import type { Lesson } from '../models/Lesson';

const mapLesson = (data: any): Lesson => ({
  id: String(data.id),
  title: data.title,
  category: data.category,
  difficulty: data.difficulty,
  description: data.description,
  duration: data.duration,
  sections: (data.sections ?? []).map((s: any) => ({
    id: String(s.id),
    title: s.title,
    content: s.content,
    formula: s.formula,
  })),
  tags: [],
  createdAt: data.createdAt,
  updatedAt: data.updatedAt,
});

export const LessonService = {
  async getAll(): Promise<Lesson[]> {
    const response = await axiosInstance.get('/lesson/getAll');
    return response.data.map(mapLesson);
  },

  async getById(id: string): Promise<Lesson> {
    const response = await axiosInstance.get(`/lesson?id=${id}`);
    return mapLesson(response.data);
  },
};