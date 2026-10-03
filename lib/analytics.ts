import { AnalysisKind } from '@/types/dto';

export const ANALYSIS_KINDS: readonly AnalysisKind[] = ['temporal', 'spatial'];

export const DEFAULT_ANALYSIS_KIND: AnalysisKind = 'temporal';

export const ANALYSIS_KIND_LABELS: Record<AnalysisKind, string> = {
  temporal: 'Time',
  spatial: 'Space',
};

type SearchParam = string | string[] | undefined;

export function parseAnalysisKind(value: SearchParam): AnalysisKind | undefined {
  return ANALYSIS_KINDS.find((kind) => kind === value);
}

/** 1-based page number; anything invalid falls back to the first page. */
export function parsePage(value: SearchParam): number {
  const page = typeof value === 'string' ? Number(value) : NaN;
  return Number.isInteger(page) && page > 0 ? page : 1;
}
