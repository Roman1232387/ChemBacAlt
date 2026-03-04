import type { Lesson } from '../models/Lesson';
import { mockLessons } from '../mock/lessons';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const mayFail = () => { if (Math.random() < 0.03) throw new Error('Eroare 500: Nu s-au putut incarca lectiile.'); };

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
