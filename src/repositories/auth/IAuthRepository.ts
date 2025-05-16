export interface User {
    email: string;
    username?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export default interface IAuthRepository {
    login(payload: LoginPayload): Promise<{ success: boolean; user?: User; message?: string; token?: string }>;
    getCurrentUser(): User | null;
}