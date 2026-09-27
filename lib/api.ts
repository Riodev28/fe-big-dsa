import { AuthResult, FileResult, SpatialAiResult, TemporalAiResult } from '@/types/dto';
import { LoginPayload, RegisterPayload, SaveFilePayload, TemporalAnalysisPayload, UpdateFilePayload, UserPayload } from '@/types/request'
import axios from 'axios';
import { getAuthToken } from '@/lib/auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

async function get<T>(path: string): Promise<T> {
  const { data } = await api.get<T>(path);
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
