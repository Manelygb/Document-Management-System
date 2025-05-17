import APIUserRepository from "../../repositories/users/APIUserRepository";
import { User } from "../../repositories/users/IUserRepository";

// We'll define initial dummy data for initial rendering
export let tableData: User[] = [
  {
    id: 1,
    name: "Loading...",
    email: "loading@example.com",
    department: "Loading...",
  }
];

// Columns definition remains the same
export const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "department", label: "Department" },
];

// Initialize metrics with initial values
export let metricsData = [
  {
    label: "Total Users",
    value: "0"
  },
  // {
  //   label: "Active Users",
  //   value: "0"
  // }
];

// Function to fetch data from API and update tableData and metricsData
export async function fetchTableData() {
  try {
    const userRepository = new APIUserRepository();
    // Fetch users with pagination
    const response = await userRepository.fetchUsers({ page: 1, per_page: 10 });
    console.log("API Response:", response);
    
    if (response && response.data && Array.isArray(response.data)) {
      // Update tableData with API response
      tableData = response.data.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department || "Not specified",
      }));
      
      // Update metrics
      if (metricsData && metricsData.length > 0) {
        metricsData[0].value = response.pagination?.total_records?.toString() || tableData.length.toString();
      }
      
      console.log("Updated tableData:", tableData);
      console.log("Updated metricsData:", metricsData);
      
      return tableData;
    } else {
      console.error("Invalid API response format:", response);
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return [];
  }
}

// Immediately invoke data fetching
fetchTableData().then(data => {
  console.log("Data loaded:", data.length, "users");
}).catch(err => {
  console.error("Error loading data:", err);
});

// Export a function to initialize data that can be called from components
export async function initializeData() {
  const data = await fetchTableData();
  return {
    tableData,
    metricsData
  };
}