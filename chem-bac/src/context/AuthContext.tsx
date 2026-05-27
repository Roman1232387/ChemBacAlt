import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { AuthUser, LoginCredentials } from '../models/User';
import { AuthService } from '../services/AuthService';

interface JwtPayload {
  userId?: string;
  name?: string;
  email?: string;
  role?: string;
  exp?: number;
}

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const mapTokenToUser = (token: string): AuthUser | null => {
  const payload = decodeJwtPayload(token);
  if (!payload?.userId || !payload.email || !payload.name || !payload.role) return null;
  if (payload.exp && payload.exp * 1000 <= Date.now()) return null;

  const role = payload.role.toLowerCase() === 'admin' ? 'admin' : 'user';
  return {
    id: payload.userId,
    name: payload.name,
    email: payload.email,
    role,
    avatarInitials: payload.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase(),
    createdAt: '',
  };
};

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on page refresh
  useEffect(() => {
    const token = AuthService.restoreToken();
    const restored = token ? mapTokenToUser(token) : null;
    if (restored) {
      setUser(restored);
    } else {
      AuthService.logout();
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AuthService.login(credentials);
      const authUser = mapTokenToUser(token);
      if (!authUser) throw new Error('Token JWT invalid.');
      setUser(authUser);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Eroare necunoscuta.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await AuthService.register(userData);
      const authUser = mapTokenToUser(token);
      if (!authUser) throw new Error('Token JWT invalid.');
      setUser(authUser);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Eroare necunoscuta.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === 'admin',
      error,
      login,
      register,
      logout,
      clearError,
    }),
    [user, isLoading, error, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
