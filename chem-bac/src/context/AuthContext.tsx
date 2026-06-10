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

const mapToAuthUser = (userData: any): AuthUser => {
  return {
    ...userData,
    id: String(userData.id),
    role: (userData.role?.toLowerCase() === 'admin' ? 'admin' : 'user') as any,
    avatarInitials: userData.name
      .split(' ')
      .filter(Boolean)
      .map((part: string) => part[0])
      .join('')
      .toUpperCase(),
    createdAt: userData.createdAt || '',
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on page refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userData = await AuthService.getMe();
        if (userData) {
          setUser(mapToAuthUser(userData));
        }
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const authUserRaw = await AuthService.login(credentials);
      setUser(mapToAuthUser(authUserRaw));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Eroare necunoscută.';
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
      const authUserRaw = await AuthService.register(userData);
      setUser(mapToAuthUser(authUserRaw));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Eroare necunoscută.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setError(null);
      window.location.href = '/login';
    }
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
