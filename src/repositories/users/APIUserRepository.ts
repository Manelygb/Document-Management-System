import axios from "axios";
import IUserRepository, { FetchUsersParams, FetchUsersResponse } from "./IUserRepository";

const API_BASE_URL = "http://localhost:5000/api/users";

class APIUserRepository implements IUserRepository {
    async fetchUsers(params: FetchUsersParams): Promise<FetchUsersResponse> {
        console.log("API Fetch Users...");
        try {
            const response = await axios.post<FetchUsersResponse>(API_BASE_URL, params.filters || [], {
                params: {
                    page: params.page || 1,
                    per_page: params.per_page || 10,
                    sort_by: params.sort_by || "id",
                    order: params.order || "asc",
                },
            });
            return response.data;
        } catch (error: any) {
            console.error("API request failed:", error.message);
            throw error;
        }
    }
}

export default APIUserRepository;
