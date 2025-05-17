export interface User {
    id: number;
    name: string;
    email: string;
    department: string;
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

export default interface IUserRepository {
    fetchUsers(params: FetchUsersParams): Promise<FetchUsersResponse>;
}
