import { SpatialAiResult, TemporalAiResult } from '@/types/dto';
import { TemporalAnalysisPayload } from '@/types/request'
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

export function analyzeTemporalComplexity({code, explain_ai}: TemporalAnalysisPayload): Promise<TemporalAiResult> {
  return post<TemporalAiResult>('/analyze/temporal', {code, explain_ai});
}

export function analyzeSpatialComplexity({code, explain_ai}: TemporalAnalysisPayload): Promise<SpatialAiResult> {
  return post<SpatialAiResult>('/analyze/spatial', {code, explain_ai});
}
