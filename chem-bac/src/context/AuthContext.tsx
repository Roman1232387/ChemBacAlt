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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore session on page refresh
  useEffect(() => {
    const restored = AuthService.restoreSession();
    if (restored) setUser(restored);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const authUser = await AuthService.login(credentials);
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
      const authUser = await AuthService.register(userData);
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
