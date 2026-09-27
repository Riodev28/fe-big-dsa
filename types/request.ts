export interface TemporalAnalysisPayload {
    code: string;
    explain_ai: boolean;
}

export interface SpatialAnalysisPayload {
    code: string;
    explain_ai: boolean;
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
