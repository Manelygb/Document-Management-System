import IUserRepository, { FetchUsersParams, FetchUsersResponse, User } from "./IUserRepository";
import API from "../../utils/axios";

export const fetchUsers = async () => {
  const response = await API.get("/auth/users");
  return response.data;
};

class APIUserRepository implements IUserRepository {
  async fetchUsers(params: FetchUsersParams): Promise<FetchUsersResponse> {
    console.log("API Fetch Users...");
    try {
      const response = await API.get("/auth/users");

      const mappedUsers: User[] = response.data.map((user: any) => ({
        id: user.userId,
        name: user.fullName,
        email: user.email,
        department: user.department
      }));

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
