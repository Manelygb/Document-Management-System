import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import MultiSelect from "../../components/form/MultiSelect";

// Configuration flag to toggle between mock data and real API
const USE_MOCK_DATA = false; // Set to false to use real API

// API configuration
const API_BASE_URL = 'http://localhost:8080';
let authToken = ''; // This would typically be managed with context/redux in a real app

// Custom notification function instead of toast
const notify = (message: string, type: 'success' | 'error') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // In a real app, you would show a toast notification here
  alert(`${type === 'success' ? 'Success' : 'Error'}: ${message}`);
};

interface Department {
  id: number;
  name: string;
}

// Dummy department data to replace API call when mocking
const dummyDepartments: Department[] = [
  { id: 1, name: "IT" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Human Resources" },
  { id: 5, name: "Operations" },
  { id: 6, name: "Research & Development" }
];


export default function CreateUser() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "", // Added username field
    fullName: "", // Added fullName field for concatenation
    role: "USER", // Default role
    department: [], // Changed to array for selected departments (will store names)
    companyId: 1 // Default company ID
  });
  const [selectedDepartmentNames, setSelectedDepartmentNames] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get auth token from localStorage or sessionStorage if available
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (storedToken) {
      authToken = storedToken;
    }
    
    const fetchDepartments = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          setDepartments(dummyDepartments);
        } else {
          // const response = await fetch(`${API_BASE_URL}/departments`, {
          //   headers: {
          //     'Authorization': `Bearer ${authToken}`
          //   },
          // });

          // if (!response.ok) {
          //   throw new Error("Failed to fetch departments");
          // }

          // const data = await response.json();
          setDepartments(dummyDepartments);
        }
      } catch (err) {
        console.error("Error fetching departments:", err);
        notify("Failed to load departments", "error");
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Generate username when first or last name changes
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      // Concatenate full name
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      // Generate username by lowercasing full name and adding two random numbers
      const baseUsername = fullName.toLowerCase().replace(/\s+/g, '');
      const randomNumbers = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const username = `${baseUsername}${randomNumbers}`;
      
      setFormData(prev => ({
        ...prev,
        username,
        fullName
      }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check for authentication token
      if (!authToken) {
        setError('Authentication required. Please login first.');
        notify('Authentication required. Please login first.', 'error');
        return;
      }
      
      const userData = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: selectedDepartmentNames.join(","), // Join the department names
        companyId: formData.companyId
      };
      
      if (USE_MOCK_DATA) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock successful user creation
        const mockUserId = Math.floor(Math.random() * 1000);
        
        // Log the data that would be sent to the server
        console.log("Creating user with data:", userData);
      } else {
        // Use the actual API endpoint to create user
        const response = await fetch(`${API_BASE_URL}/auth/users/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
          body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to create user');
        }
        
        console.log("User created successfully:", data);
      }

      notify("User created successfully", "success");
      navigate("/users-dashboard"); // Redirect to users list
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err instanceof Error ? err.message : "Failed to create user. Please try again.");
      notify("Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Format departments for MultiSelect component - keeping IDs as values for selection
  const departmentOptions = departments.map((dept) => ({
    value: dept.id.toString(),
    text: dept.name,
  }));
  
  // Handle department selection - convert IDs to department names
  const handleDepartmentChange = (selectedIds: string[]) => {
    // Convert selected IDs to department names
    const selectedNames = selectedIds.map(id => {
      const department = departments.find(dept => dept.id.toString() === id);
      return department ? department.name : '';
    }).filter(name => name !== ''); // Filter out any empty names that might occur
    
    setSelectedDepartmentNames(selectedNames);
    
    // Also update the department field in formData
    setFormData(prev => ({
      ...prev,
      department: selectedNames
    }));
  };

  return (
    <>
      <PageMeta title="Create User" description="Create a new user" />
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <PageBreadcrumb pageTitle="Create User" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-card dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">
                  First Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">
                  Last Name <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="username">
                Username <span className="text-gray-500">(auto-generated)</span>
              </Label>
              <Input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                readOnly
                disabled
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>

            <div className="mt-5">
              <Label htmlFor="email">
                Email <span className="text-error-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mt-5">
              <Label htmlFor="password">
                Password <span className="text-error-500">*</span>
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
                   
            <div className="mt-5">
              {loadingDepartments ? (
                <div className="text-gray-500 dark:text-gray-400">Loading departments...</div>
              ) : (
                <>
                  <MultiSelect
                    label="Assign to Departments"
                    options={departmentOptions}
                    onChange={handleDepartmentChange}
                    defaultSelected={[]}
                    closeMenuOnSelect={true}
                  />
                  {selectedDepartmentNames.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Selected departments: {selectedDepartmentNames.join(", ")}
                    </div>
                  )}
                </>
              )}
            </div>

            {error && (
              <div className="mt-5 rounded-lg bg-error-50 p-4 text-error-500 dark:bg-error-500/10">
                {error}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.password || !formData.firstName || !formData.lastName}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-transparent bg-brand-500 px-5 py-3 font-medium text-white shadow-theme-xs hover:bg-brand-600"
              >
                {loading ? "Creating..." : "Create User"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                variant="outline"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}