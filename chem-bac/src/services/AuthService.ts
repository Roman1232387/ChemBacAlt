import axiosInstance from './axiosInstance';

const TOKEN_KEY = 'chem_bac_token';

interface AuthResponse {
  isSuccess: boolean;
  message?: string;
  token?: string;
}

const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

const decodePayload = (token: string): { exp?: number } | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)) as { exp?: number };
  } catch {
    return null;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  const payload = decodePayload(token);
  if (!payload) return false;
  return !payload.exp || payload.exp * 1000 > Date.now();
};

const requireToken = (data: AuthResponse): string => {
  if (!data.isSuccess) throw new Error(data.message ?? 'Autentificare esuata.');
  if (!data.token) throw new Error('Serverul nu a returnat token JWT.');
  saveToken(data.token);
  return data.token;
};

export const AuthService = {
  async login(credentials: { email: string; password: string }): Promise<string> {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });

    return requireToken(response.data);
  },

  async register(userData: { name: string; email: string; password: string }): Promise<string> {
    const response = await axiosInstance.post<AuthResponse>('/auth/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    return requireToken(response.data);
  },

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  restoreToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  hasValidToken(): boolean {
    return isTokenValid(localStorage.getItem(TOKEN_KEY));
  },
};
