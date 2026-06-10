import axiosInstance from './axiosInstance';
import type { Chapter } from '../models/Lesson';

const mapChapter = (data: any): Chapter => ({
  id: String(data.id),
  title: data.title,
  profile: data.profile,
  order: data.order,
});

export const ChapterService = {
  async getAll(): Promise<Chapter[]> {
    const response = await axiosInstance.get('/chapter/getAll');
    return response.data.map(mapChapter);
  },
};
