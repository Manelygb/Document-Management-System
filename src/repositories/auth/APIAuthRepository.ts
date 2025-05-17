import IAuthRepository, { LoginPayload, User } from "./IAuthRepository";
import { debugLog } from "./utils";

class APIAuthRepository implements IAuthRepository {
    private user: User | null = null;
    private authToken: string | null = null;
    private API_BASE_URL: string = "http://localhost:8080"; // Default API URL

    async login({ email, password }: LoginPayload): Promise<{ success: boolean; user?: User; message?: string; token?: string }> {
        try {
            debugLog("APIAuth", `Attempting login to ${this.API_BASE_URL}/auth/login`);
            
            const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
           
            const data = await response.json();
           
            if (response.ok) {
                this.authToken = data.token;
                this.user = { email };
    

                // Save token and user info in localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userEmail', email);
               
                debugLog("APIAuth", {
                    message: 'Login successful',
                    token: data.token ? `${data.token.substring(0, 15)}...` : 'No token received'
                });
               
                return { success: true, user: this.user, token: this.authToken! };
            } else {
                debugLog("APIAuth", { error: data.message || "Login failed" });
                return { success: false, message: data.message || "Login failed" };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
            debugLog("APIAuth", { error: errorMessage });
            
            return {
                success: false,
                message: errorMessage
            };
        }
    }

    getCurrentUser(): User | null {
        return this.user;
    }
   
    // Helper method to set API base URL
    setApiBaseUrl(url: string): void {
        if (url) {
            this.API_BASE_URL = url;
            debugLog("APIAuth", `API base URL set to: ${this.API_BASE_URL}`);
        }
    }
}

export default APIAuthRepository;
