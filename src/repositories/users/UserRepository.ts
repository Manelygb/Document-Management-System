import axios from "axios";
import MockUserRepository from "./MockUserRepository";
import IUserRepository from "./IUserRepository";
// import APIUserRepository from "./APIUserRepository"; // Future Implementation

const API_BASE_URL = "http://localhost:5000/api/users";
const ENV: string = "mock";

export interface User {
    id: number;
    name: string;
    position: string;
    address: string;
    status: string;
    email: string;
    phone: string;
    department: string;
    hire_date: string;
    employee_id: number;    
}

export interface FetchUsersParams {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: "asc" | "desc";
    filters?: { key: string; op: string; value: string }[]; 
}
export interface FetchUsersResponse {
    data: User[];
    pagination: {
      total_records: number;
      total_pages: number;
      current_page: number;
      per_page: number;
    };
  }

class UserRepository {
    private static instance: IUserRepository;

    static getInstance(): IUserRepository {
        if (!UserRepository.instance) {
            if (ENV === "api") {
                // UserRepository.instance = new APIUserRepository(); // Future Implementation
            } else {
                UserRepository.instance = new MockUserRepository();
            }
        }
        console.log("Returning an instance of UserRepository...");
        return UserRepository.instance;
    }
}

export { UserRepository };
