import { useState, useEffect, useCallback } from 'react';
import { fetchRate } from '../utils/api';

// Hook to fetch and auto-refresh live FX rate
export function useFxRate(from = 'USD', to = 'INR', refreshMs = 60000) {
  const [rate,      setRate]      = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  const loadRate = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchRate(from, to);
      setRate(data);
      setLastFetch(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      // Fallback rate
      setRate({ rate: 83.82, from, to, source: 'Fallback' });
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    loadRate();
    const interval = setInterval(loadRate, refreshMs);
    return () => clearInterval(interval);
  }, [loadRate, refreshMs]);

  return { rate, loading, error, lastFetch, refresh: loadRate };
}
