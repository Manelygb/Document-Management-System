import IUserRepository, { FetchUsersParams, FetchUsersResponse, User } from "./IUserRepository";

class MockUserRepository implements IUserRepository {
    private users: User[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        position: "Developer",
        address: "123 Main St",
        status: "Active",
        email: `user${i + 1}@example.com`,
        phone: "123-456-7890",
        department: "Engineering",
        hire_date: "2022-01-01",
        employee_id: 1000 + i + 1,
    }));

    async fetchUsers(params: FetchUsersParams): Promise<FetchUsersResponse> {
        console.log("Mock Fetch Users...");
        const { page = 1, per_page = 10 } = params;

        const start = (page - 1) * per_page;
        const end = start + per_page;

        const paginatedUsers = this.users.slice(start, end);

        return {
            data: paginatedUsers,
            pagination: {
                total_records: this.users.length,
                total_pages: Math.ceil(this.users.length / per_page),
                current_page: page,
                per_page,
            },
        };
    }
}

export default MockUserRepository;
