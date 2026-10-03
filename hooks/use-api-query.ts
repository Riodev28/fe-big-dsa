'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getApiErrorMessage } from '@/lib/auth';

export type ApiFetcher<T> = (signal: AbortSignal) => Promise<T>;

interface ApiQueryState<T> {
  data: T | undefined;
  error: string | null;
  /** HTTP status of the failed request, e.g. to tell "not found" apart from a network error */
  errorStatus: number | undefined;
  loading: boolean;
}

export interface ApiQueryResult<T> extends ApiQueryState<T> {
  reload: () => void;
}

/**
 * Runs `fetcher` on mount and whenever it changes, so memoize it with `useCallback`.
 * Superseded requests are aborted, and the previous data is kept while refetching
 * so pagination and filters don't flash an empty screen.
 */
export function useApiQuery<T>(fetcher: ApiFetcher<T>, fallbackError: string): ApiQueryResult<T> {
  const [state, setState] = useState<ApiQueryState<T>>({
    data: undefined,
    error: null,
    errorStatus: undefined,
    loading: true,
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState((prev) => ({ ...prev, error: null, errorStatus: undefined, loading: true }));

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ data, error: null, errorStatus: undefined, loading: false });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          error: getApiErrorMessage(err, fallbackError),
          errorStatus: axios.isAxiosError(err) ? err.response?.status : undefined,
          loading: false,
        }));
      });

    return () => controller.abort();
  }, [fetcher, fallbackError, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
