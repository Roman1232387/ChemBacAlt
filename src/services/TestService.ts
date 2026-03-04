import type { Test, TestFormData } from '../models/Test';
import { mockTests } from '../mock/tests';

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const mayFail = () => { if (Math.random() < 0.03) throw new Error('Eroare 500: Serviciul de teste nu raspunde.'); };

let store: Test[] = [...mockTests];
let nextId = 100;

export const TestService = {
  async getAll(): Promise<Test[]> {
    await delay(700);
    mayFail();
    return [...store];
  },

  async getById(id: string): Promise<Test> {
    await delay(400);
    mayFail();
    const test = store.find((t) => t.id === id);
    if (!test) throw new Error(`Testul cu id "${id}" nu a fost gasit.`);
    return { ...test, questions: [...test.questions] };
  },

  async create(data: TestFormData, createdBy: string): Promise<Test> {
    await delay(800);
    mayFail();
    const newTest: Test = {
      id: `t${++nextId}`,
      ...data,
      questions: [],
      createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store = [...store, newTest];
    return { ...newTest };
  },

  async update(id: string, data: Partial<TestFormData>): Promise<Test> {
    await delay(700);
    mayFail();
    const idx = store.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error(`Testul cu id "${id}" nu a fost gasit.`);
    const updated: Test = { ...store[idx], ...data, updatedAt: new Date().toISOString() };
    store = store.map((t) => (t.id === id ? updated : t));
    return { ...updated };
  },

  async delete(id: string): Promise<void> {
    await delay(600);
    mayFail();
    if (!store.some((t) => t.id === id)) throw new Error(`Testul cu id "${id}" nu exista.`);
    store = store.filter((t) => t.id !== id);
  },
};
