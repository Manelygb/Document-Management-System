import MockAuthRepository from "./MockAuthRepository";
import APIAuthRepository from "./APIAuthRepository";
import IAuthRepository from "./IAuthRepository";
import { debugLog } from "./utils";

// Environment configuration - can be changed to "api" or "mock"
const ENV: string = "api";  // Changed from "mock" to "api"

// API base URL - configure for your environment
const API_BASE_URL = "http://localhost:8080";

class AuthRepository {
    private static instance: IAuthRepository;
   
    static getInstance(): IAuthRepository {
        if (!AuthRepository.instance) {
            if (ENV === "api") {
                const apiRepo = new APIAuthRepository();
                // Use the constant defined above
                apiRepo.setApiBaseUrl(API_BASE_URL);
                AuthRepository.instance = apiRepo;
            } else {
                AuthRepository.instance = new MockAuthRepository();
            }
        }
       
        debugLog("AuthRepository", `Using ${ENV === "api" ? "API" : "Mock"} auth repository`);
        return AuthRepository.instance;
    }
   
    // Method to manually set repository type - useful for testing
    static setRepositoryType(type: "api" | "mock"): void {
        if (type === "api") {
            const apiRepo = new APIAuthRepository();
            apiRepo.setApiBaseUrl(API_BASE_URL);
            AuthRepository.instance = apiRepo;
        } else {
            AuthRepository.instance = new MockAuthRepository();
        }
        debugLog("AuthRepository", `Repository type changed to: ${type}`);
    }
}

export default AuthRepository;