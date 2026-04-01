import type { Lesson } from '../models/Lesson';
import { mockLessons } from '../mock/lessons';

import { delay, mayFail } from './ApiUtils';

const store: Lesson[] = [...mockLessons];

export const LessonService = {
  async getAll(): Promise<Lesson[]> {
    await delay(600);
    mayFail();
    return [...store];
  },

  async getById(id: string): Promise<Lesson> {
    await delay(400);
    mayFail();
    const lesson = store.find((l) => l.id === id);
    if (!lesson) throw new Error(`Lectia cu id "${id}" nu a fost gasita.`);
    return { ...lesson };
  },
};
