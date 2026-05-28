import axiosInstance from './axiosInstance';
import type { Lesson, LessonFormData } from '../models/Lesson';

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

const mapSectionForApi = (section: Lesson['sections'][number], index: number) => ({
  id: Number(section.id) || 0,
  title: section.title,
  content: section.content,
  formula: section.formula,
  order: index + 1,
});

const assertLessonPayload = (data: any): void => {
  if (!data || typeof data.id === 'undefined' || !data.title) {
    throw new Error(data?.message ?? 'Raspuns invalid de la server pentru lectie.');
  }
};

export const LessonService = {
  async getAll(): Promise<Lesson[]> {
    const response = await axiosInstance.get('/lesson/getAll');
    return response.data.map(mapLesson);
  },

  async getById(id: string): Promise<Lesson> {
    const response = await axiosInstance.get(`/lesson?id=${id}`);
    return mapLesson(response.data);
  },

  async create(data: LessonFormData): Promise<Lesson> {
    const response = await axiosInstance.post('/lesson', {
      id: 0,
      title: data.title,
      category: data.category,
      difficulty: data.difficulty,
      description: data.description,
      duration: data.duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: data.sections.map(mapSectionForApi),
    });
    assertLessonPayload(response.data);
    return mapLesson(response.data);
  },

  async update(id: string, data: LessonFormData): Promise<Lesson> {
    const response = await axiosInstance.put('/lesson', {
      id: Number(id),
      title: data.title,
      category: data.category,
      difficulty: data.difficulty,
      description: data.description,
      duration: data.duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: data.sections.map(mapSectionForApi),
    });
    assertLessonPayload(response.data);
    return mapLesson(response.data);
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(`/lesson?id=${id}`);
  },
};
