import type { AuthUser, LoginCredentials } from '../models/User';
import { mockUsers } from '../mock/users';

const STORAGE_KEY = 'chem_bac_user';
const USERS_KEY = 'chem_bac_users';
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const mayFail = () => { if (Math.random() < 0.03) throw new Error('Eroare 500: Serviciul de autentificare nu raspunde.'); };

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    await delay(800);
    mayFail();
    const allUsers = AuthService.getAllUsers();
    const user = allUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) throw new Error('Email sau parola incorecte.');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...authUser } = user;
    AuthService.saveSession(authUser);
    return authUser;
  },

  async register(userData: { name: string; email: string; password: string }): Promise<AuthUser> {
    await delay(1000);
    mayFail();
    const allUsers = AuthService.getAllUsers();

    // Check if email already exists
    if (allUsers.some(u => u.email === userData.email)) {
      throw new Error('Email-ul este deja înregistrat.');
    }

    const newUser = {
      id: `u${Date.now()}`,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      role: 'user' as const,
      avatarInitials: userData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    allUsers.push(newUser);
    AuthService.saveAllUsers(allUsers);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...authUser } = newUser;
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

  getAllUsers(): typeof mockUsers {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : [...mockUsers];
    } catch {
      return [...mockUsers];
    }
  },

  saveAllUsers(users: typeof mockUsers): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
};
