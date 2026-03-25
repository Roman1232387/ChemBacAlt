import type { User } from '../models/User';

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'admin@chimie-bac.ro',
    password: 'Admin123!',
    name: 'Prof. Elena Ionescu',
    role: 'admin',
    avatarInitials: 'EI',
    createdAt: '2024-01-01T08:00:00Z',
  },
  {
    id: 'u2',
    email: 'elev@chimie-bac.ro',
    password: 'Elev123!',
    name: 'Andrei Popescu',
    role: 'user',
    avatarInitials: 'AP',
    createdAt: '2024-02-15T09:00:00Z',
  },
  {
    id: 'u3',
    email: 'maria.ion@liceu.ro',
    password: 'Maria2025!',
    name: 'Maria Ion',
    role: 'user',
    avatarInitials: 'MI',
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'u4',
    email: 'alexandru.dumitrescu@scoala.ro',
    password: 'Alex2025!',
    name: 'Alexandru Dumitrescu',
    role: 'user',
    avatarInitials: 'AD',
    createdAt: '2024-03-15T11:00:00Z',
  },
];
