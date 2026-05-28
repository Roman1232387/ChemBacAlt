import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — Custom hook for accessing authentication context.
 * Throws if used outside of <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth trebuie folosit in interiorul unui <AuthProvider>.');
  return ctx;
}
