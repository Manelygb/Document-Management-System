import IAuthRepository, { LoginPayload, SignUpPayload, User } from "./IAuthRepository";

class MockAuthRepository implements IAuthRepository {
    private user: User | null = null;

    async login({ email, password }: LoginPayload): Promise<{ success: boolean; user?: User; message?: string }> {
        console.log("Mock Login...");

        if (email === "admin@gmail.com" && password === "password123") {
            this.user = { email }; // No username, only email
            return { success: true, user: this.user };
        }
        console.log('here');
        return { success: false, message: "Invalid credentials" };
        
    }

    async signup({ firstName, lastName, email, password }: SignUpPayload): Promise<{ success: boolean; user?: User; message?: string }> {
        console.log("Mock Sign-Up...");
        
        // Simulate a simple email check
        if (email === "existing@gmail.com") {
            return { success: false, message: "Email already in use" };
        }

        this.user = { firstName, lastName, email };
        return { success: true, user: this.user };
    }

    async logout(): Promise<void> {
        this.user = null;
        console.log("User logged out");
    }

    getCurrentUser(): User | null {
        return this.user;
    }
}

export default MockAuthRepository;
