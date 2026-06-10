import axiosInstance from './axiosInstance';
import type { AuthUser } from '../models/User';

interface AuthResponse {
  isSuccess: boolean;
  message?: string;
  user?: AuthUser;
}

export const AuthService = {
  async login(credentials: { email: string; password: string }): Promise<AuthUser> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    if (!response.data.isSuccess || !response.data.user) {
      throw new Error(response.data.message ?? 'Autentificare eșuată.');
    }
    return response.data.user;
  },

  async register(userData: { name: string; email: string; password: string }): Promise<AuthUser> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', userData);

    if (!response.data.isSuccess || !response.data.user) {
      throw new Error(response.data.message ?? 'Înregistrare eșuată.');
    }
    return response.data.user;
  },

  async getMe(): Promise<AuthUser> {
    const response = await axiosInstance.get<AuthUser>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    }
  },
};
