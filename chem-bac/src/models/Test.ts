import type { Question } from './Question';

export type TestStatus = 'draft' | 'published' | 'archived';

export interface Test {
  id: string;
  title: string;
  description: string;
  lessonId: string;
  questions: Question[];
  duration: number;
  passingScore: number;
  status: TestStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TestFormData {
  title: string;
  description: string;
  lessonId: string;
  questions: Question[];
  duration: number;
  passingScore: number;
  status: TestStatus;
}

export const TEST_STATUS_LABELS: Record<TestStatus, string> = {
  draft: 'Draft',
  published: 'Publicat',
  archived: 'Arhivat',
};
