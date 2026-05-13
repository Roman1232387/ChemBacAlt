import axiosInstance from './axiosInstance';
import type { AuthUser, LoginCredentials } from '../models/User';

const STORAGE_KEY = 'chem_bac_user';

const mapUser = (data: any): AuthUser => ({
  id: String(data.id),
  name: data.name,
  email: data.email,
  role: data.role,
  avatarInitials: data.avatarInitials,
  createdAt: data.createdAt,
});

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await axiosInstance.post('/user/login', {
      email: credentials.email,
      password: credentials.password,
    });
    const data = response.data;
    if (!data.isSuccess) throw new Error(data.message);
    const authUser = mapUser(data.user);
    AuthService.saveSession(authUser);
    return authUser;
  },

  async register(userData: { name: string; email: string; password: string }): Promise<AuthUser> {
    const registerResponse = await axiosInstance.post('/user/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });
    if (!registerResponse.data.isSuccess)
      throw new Error(registerResponse.data.message);

    return AuthService.login({
      email: userData.email,
      password: userData.password,
    });
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  saveSession(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  restoreSession(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  },
};