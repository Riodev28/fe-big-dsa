import {
  AnalysisDetailResult,
  AnalysisPage,
  AuthResult,
  ComplexityTrendsResult,
  DashboardSummaryResult,
  FileResult,
  SpatialAiResult,
  TemporalAiResult,
} from '@/types/dto';
import {
  AnalysesQuery,
  DashboardQuery,
  DashboardTrendsQuery,
  LoginPayload,
  RegisterPayload,
  SaveFilePayload,
  TemporalAnalysisPayload,
  UpdateFilePayload,
  UserPayload,
} from '@/types/request'
import axios, { AxiosError, GenericAbortSignal, InternalAxiosRequestConfig } from 'axios';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/lib/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Required so the httpOnly refresh_token cookie is stored on login and sent to /refresh
  withCredentials: true,
});

// Endpoints whose 401 means "bad credentials", not "access token expired"
const AUTH_PATHS = ['/login', '/register', '/refresh', '/logout'];

// Refresh this long before the access token actually expires, to absorb clock skew and latency
const EXPIRY_MARGIN_MS = 30_000;

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

function isAuthPath(url: string | undefined): boolean {
  return AUTH_PATHS.some((path) => url?.startsWith(path));
}

function isTokenExpiring(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && payload.exp * 1000 - EXPIRY_MARGIN_MS <= Date.now();
  } catch {
    return true;
  }
}

function endSession() {
  clearAuthToken();
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
    window.location.href = '/auth/login';
  }
}

api.interceptors.request.use(async (config: RetryableConfig) => {
  let token = getAuthToken();

  // Proactively refresh an expired access token instead of waiting for a 401
  if (token && !isAuthPath(config.url) && isTokenExpiring(token)) {
    try {
      token = await refreshAccessToken();
    } catch {
      // Session is over; send the request anonymously so public endpoints still work.
      // If the endpoint requires auth, the 401 handler ends the session without refreshing again.
      clearAuthToken();
      token = null;
      config._retry = true;
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status !== 401 || !original || isAuthPath(original.url)) {
      return Promise.reject(error);
    }
    if (original._retry) {
      endSession();
      return Promise.reject(error);
    }
    original._retry = true;

    try {
      const token = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch {
      endSession();
      return Promise.reject(error);
    }
  }
);

// Serializes refreshes across browser tabs (the access token in localStorage is shared by all of them)
function withRefreshLock<T>(callback: () => Promise<T>): Promise<T> {
  if (typeof navigator !== 'undefined' && navigator.locks) {
    return navigator.locks.request('bigdsa-token-refresh', callback) as Promise<T>;
  }
  return callback();
}

// Only one /refresh may ever use a given cookie: the backend rotates the refresh token
// and treats reuse of a rotated one as theft, revoking every session of the user.
// Concurrent calls in this tab share one promise, and other tabs wait on the lock.
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    const staleToken = getAuthToken();
    refreshPromise = withRefreshLock(async () => {
      // Another tab may have refreshed while we waited for the lock; reuse its token
      const current = getAuthToken();
      if (current && current !== staleToken && !isTokenExpiring(current)) {
        return current;
      }
      const { data } = await api.post<AuthResult>('/refresh');
      setAuthToken(data.access_token);
      return data.access_token;
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function post<T>(
  path: string,
  body: unknown,
  contentType = 'application/json'
): Promise<T> {
  const { data } = await api.post<T>(path, body, {
    headers: { 'Content-Type': contentType },
  });
  return data;
}

async function put<T>(path: string, body: unknown): Promise<T> {
  const { data } = await api.put<T>(path, body);
  return data;
}

async function del(path: string): Promise<void> {
  await api.delete(path);
}

interface GetOptions {
  params?: object;
  signal?: GenericAbortSignal;
}

async function get<T>(path: string, { params, signal }: GetOptions = {}): Promise<T> {
  const { data } = await api.get<T>(path, { params, signal });
  return data;
}

export function analyzeTemporalComplexity({code, explain_ai}: TemporalAnalysisPayload): Promise<TemporalAiResult> {
  return post<TemporalAiResult>('/analyze/temporal', {code, explain_ai});
}

export function analyzeSpatialComplexity({code, explain_ai}: TemporalAnalysisPayload): Promise<SpatialAiResult> {
  return post<SpatialAiResult>('/analyze/spatial', {code, explain_ai});
}

export function login(payload: LoginPayload): Promise<AuthResult> {
  return post<AuthResult>('/login', payload);
}

export function registerUser(payload: RegisterPayload): Promise<AuthResult> {
  return post<AuthResult>('/register', payload);
}

export function logout(): Promise<void> {
  return post<void>('/logout', null);
}

export function me(): Promise<UserPayload> {
  return get<UserPayload>('/me');
}

export function getFiles(): Promise<FileResult[]> {
  return get<FileResult[]>('/files');
}

export function getFile(id: string): Promise<FileResult> {
  return get<FileResult>(`/file/${encodeURIComponent(id)}`);
}

export function saveFile(payload: SaveFilePayload): Promise<FileResult> {
  return post<FileResult>('/file', payload);
}

export function updateFile(id: string, payload: UpdateFilePayload): Promise<FileResult> {
  return put<FileResult>(`/file/${encodeURIComponent(id)}`, payload);
}

export function deleteFile(id: string): Promise<void> {
  return del(`/file/${encodeURIComponent(id)}`);
}

export function getDashboardSummary(
  query: DashboardQuery = {},
  signal?: GenericAbortSignal
): Promise<DashboardSummaryResult> {
  return get<DashboardSummaryResult>('/dashboard/summary', { params: query, signal });
}

export function getDashboardTrends(
  query: DashboardTrendsQuery = {},
  signal?: GenericAbortSignal
): Promise<ComplexityTrendsResult> {
  return get<ComplexityTrendsResult>('/dashboard/trends', { params: query, signal });
}

export function getAnalyses(
  query: AnalysesQuery = {},
  signal?: GenericAbortSignal
): Promise<AnalysisPage> {
  return get<AnalysisPage>('/analyses', { params: query, signal });
}

export function getAnalysis(id: string, signal?: GenericAbortSignal): Promise<AnalysisDetailResult> {
  return get<AnalysisDetailResult>(`/analyses/${encodeURIComponent(id)}`, { signal });
}
