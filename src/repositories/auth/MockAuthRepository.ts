import IAuthRepository, { LoginPayload, User } from "./IAuthRepository";
import { debugLog } from "./utils";

class MockAuthRepository implements IAuthRepository {
    private user: User | null = null;
    private authToken: string | null = null;

    async login({ email, password }: LoginPayload): Promise<{ success: boolean; user?: User; message?: string; token?: string }> {
        debugLog("MockAuth", "Attempting login...");

        if (email === "admin@gmail.com" && password === "password123") {
            this.authToken = "mock-jwt-token-" + Math.random().toString(36).substring(2);
            this.user = { email, username: email.split('@')[0] };
            
            debugLog("MockAuth", { 
                message: 'Login successful', 
                token: `${this.authToken.substring(0, 15)}...` 
            });
            
            return { success: true, user: this.user, token: this.authToken };
        }
        
        debugLog("MockAuth", { message: "Invalid credentials" });
        return { success: false, message: "Invalid credentials" };
    }

    getCurrentUser(): User | null {
        return this.user;
    }
}

export default MockAuthRepository;