import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AxiosError, type AxiosInstance } from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const TOKEN_KEY = 'chem_bac_token';

interface ApiContextValue {
  client: AxiosInstance;
  globalError: string | null;
  clearGlobalError: () => void;
}

export const ApiContext = createContext<ApiContextValue | null>(null);

const getErrorMessage = (status?: number): string => {
  switch (status) {
    case 400:
      return 'Cererea trimisa nu este valida.';
    case 401:
      return 'Sesiunea a expirat. Autentifica-te din nou.';
    case 403:
      return 'Nu ai permisiuni pentru aceasta actiune.';
    case 404:
      return 'Resursa cautata nu a fost gasita.';
    case 409:
      return 'Datele trimise intra in conflict cu datele existente.';
    case 500:
      return 'A aparut o eroare pe server.';
    default:
      return 'A aparut o eroare la comunicarea cu serverul.';
  }
};

export function ApiProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const clearGlobalError = useCallback(() => {
    setGlobalError(null);
  }, []);

  useEffect(() => {
    const interceptorId = axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;
        const message = error.response?.data?.message ?? getErrorMessage(status);

        setGlobalError(message);

        if (status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          navigate('/login', { replace: true });
        }

        if (status === 403) {
          navigate('/403', { replace: true });
        }

        if (status === 500) {
          navigate('/500', { replace: true });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptorId);
    };
  }, [navigate]);

  const value = useMemo<ApiContextValue>(
    () => ({
      client: axiosInstance,
      globalError,
      clearGlobalError,
    }),
    [globalError, clearGlobalError]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}
