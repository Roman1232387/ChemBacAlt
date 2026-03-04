import type { AuthUser, LoginCredentials } from '../models/User';
import { mockUsers } from '../mock/users';

const STORAGE_KEY = 'chem_bac_user';
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const mayFail = () => { if (Math.random() < 0.03) throw new Error('Eroare 500: Serviciul de autentificare nu raspunde.'); };

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    await delay(800);
    mayFail();
    const user = mockUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) throw new Error('Email sau parola incorecte.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...authUser } = user;
    AuthService.saveSession(authUser);
    return authUser;
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
