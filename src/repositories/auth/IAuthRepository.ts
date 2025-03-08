export interface User {
    email: string;
    firstName?: string;
    lastName?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignUpPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default interface IAuthRepository {
    login(payload: LoginPayload): Promise<{ success: boolean; user?: User; message?: string }>;
    signup(payload: SignUpPayload): Promise<{ success: boolean; user?: User; message?: string }>;
    logout(): Promise<void>;
    getCurrentUser(): User | null;
}
