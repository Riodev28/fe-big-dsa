import { AnalysisKind } from '@/types/dto';

export interface TemporalAnalysisPayload {
    code: string;
    explain_ai: boolean;
    title?: string;
}

export interface SpatialAnalysisPayload {
    code: string;
    explain_ai: boolean;
    title?: string;
}

export interface LoginPayload extends Omit<UserPayload, 'username'> {
    password: string;
}

export interface RegisterPayload extends UserPayload{
    password: string;
    password_check: string;
}

export interface UserPayload {
    username: string;
    email: string;
}

export interface SaveFilePayload {
    title: string;
    content: string;
}

export type UpdateFilePayload = SaveFilePayload;

export interface DashboardQuery {
    kind?: AnalysisKind;
}

export interface DashboardTrendsQuery extends DashboardQuery {
    /** 1 to 24, defaults to 6 on the backend */
    months?: number;
}

export interface AnalysesQuery {
    /** Omit to list both kinds */
    kind?: AnalysisKind;
    /** 1 to 100, defaults to 10 on the backend */
    limit?: number;
    offset?: number;
}
