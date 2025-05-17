import axios from "axios";
import MockUserRepository from "./MockUserRepository";
import IUserRepository from "./IUserRepository";
import APIUserRepository from "./APIUserRepository";

// Define a consistent API_BASE_URL
const API_BASE_URL = "http://localhost:8080"; // Match the URL in APIUserRepository

// Set to 'mock' for testing or 'api' for real API
const ENV: string = "api"; // Changed to api to use the real implementation

class UserRepository {
    private static instance: IUserRepository;
    
    static getInstance(): IUserRepository {
        if (!UserRepository.instance) {
            if (ENV === "api") {
                console.log("Creating API repository instance...");
                UserRepository.instance = new APIUserRepository();
            } else {
                console.log("Creating Mock repository instance...");
                UserRepository.instance = new MockUserRepository();
            }
        }
        console.log("Returning an instance of UserRepository...");
        return UserRepository.instance;
    }
    
    // Helper method to switch implementations for testing
    static switchToMock(): void {
        console.log("Switching to mock repository...");
        UserRepository.instance = new MockUserRepository();
    }
    
    static switchToAPI(): void {
        console.log("Switching to API repository...");
        UserRepository.instance = new APIUserRepository();
    }
}

export { UserRepository };