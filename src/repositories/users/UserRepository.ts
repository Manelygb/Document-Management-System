import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/users";

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

export const UserRepository = {
    fetchUsers: async (params: FetchUsersParams) => {
      console.log("Sending request with:", params);
      
      try {
        const response = await axios.post(API_BASE_URL, params.filters || [], {
          params: {
            page: params.page || 1,
            per_page: params.per_page || 10,
            sort_by: params.sort_by || "id",
            order: params.order || "asc",
          },
        });
        console.log("Response received:", response.data);
        return response.data;
      } catch (error: any) {
        console.error("API request failed:", error.message);
        throw error;
      }
    },
  };
  