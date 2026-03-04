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
];
