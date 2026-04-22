import { useState, useCallback } from 'react';

interface ApiState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}

export function useApi<T>() {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        isLoading: false,
        error: null,
    });

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        setState({ data: null, isLoading: true, error: null });
        try {
            const result = await apiCall();
            setState({ data: result, isLoading: false, error: null });
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Eroare necunoscuta.';
            setState({ data: null, isLoading: false, error: message });
            throw err;
        }
    }, []);

    return { ...state, execute };
}