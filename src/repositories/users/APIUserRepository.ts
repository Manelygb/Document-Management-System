import axios from "axios";
import IUserRepository, { FetchUsersParams, FetchUsersResponse, User } from "./IUserRepository";

const API_BASE_URL = "http://localhost:8080";

class APIUserRepository implements IUserRepository {
    async fetchUsers(params: FetchUsersParams): Promise<FetchUsersResponse> {
        console.log("API Fetch Users...");
        try {
            // Get the auth token from localStorage
            const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            
            if (!authToken) {
                throw new Error("Authentication required. Please login first.");
            }

            const response = await axios.get(`${API_BASE_URL}/auth/users`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            // Map the API response to match our User interface
            // Only extract id, fullName, email, and department
            const mappedUsers: User[] = response.data.map((user: any) => ({
                id: user.userId,
                name: user.fullName,
                email: user.email,
                department: user.department
            }));
            
            // Handle pagination
            // Since your API might not provide pagination info directly,
            // we'll implement client-side pagination
            const { page = 1, per_page = 10 } = params;
            const startIndex = (page - 1) * per_page;
            const endIndex = startIndex + per_page;
            const paginatedUsers = mappedUsers.slice(startIndex, endIndex);
            
            return {
                data: paginatedUsers,
                pagination: {
                    total_records: mappedUsers.length,
                    total_pages: Math.ceil(mappedUsers.length / per_page),
                    current_page: page,
                    per_page: per_page,
                },
            };
        } catch (error: any) {
            console.error("API request failed:", error.message);
            throw error;
        }
    }
}

export default APIUserRepository;