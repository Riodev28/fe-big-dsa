import axios from 'axios';

const TOKEN_KEY = 'bigdsa_access_token';

export function setAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === 'string') return detail;
  }
  return fallback;
}
