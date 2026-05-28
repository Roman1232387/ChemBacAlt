export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
  createdAt: string;
}

export type AuthUser = Omit<User, 'password'>;

export interface LoginCredentials {
  email: string;
  password: string;
}
