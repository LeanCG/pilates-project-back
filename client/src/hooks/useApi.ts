import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/axios';

// client-swr-dedup: generic hook to fetch data & deduplicate loading state
export function useApi<T>(endpoint: string, deps: unknown[] = []) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // rerender-functional-setstate: use functional updates for stability
    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<T>(endpoint);
            setData(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar datos');
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endpoint, ...deps]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    return { data, loading, error, refetch };
}
