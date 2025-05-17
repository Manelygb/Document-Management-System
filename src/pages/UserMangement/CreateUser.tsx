import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import MultiSelect from "../../components/form/MultiSelect";

// Configuration flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

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
  { id: 1, name: "Engineering" },
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
    role: "USER", // Default role
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 800));
          setDepartments(dummyDepartments);
        } else {
          const response = await fetch("/api/departments", {
            headers: {
              // Add authorization header if needed
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch departments");
          }

          const data = await response.json();
          setDepartments(data);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (USE_MOCK_DATA) {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Mock successful user creation
        const mockUserId = Math.floor(Math.random() * 1000);
        
        // Log the data that would be sent to the server
        console.log("Creating user with data:", formData);
        console.log("Assigning to departments:", selectedDepartments);
      } else {
        // First, create the user
        const userResponse = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
          },
          body: JSON.stringify(formData),
        });

        if (!userResponse.ok) {
          throw new Error("Failed to create user");
        }

        const userData = await userResponse.json();
        const userId = userData.id;

        // Next, assign the user to selected departments
        if (selectedDepartments.length > 0) {
          const assignPromises = selectedDepartments.map((departmentId) => 
            fetch(`/api/departments/${departmentId}/users/${userId}`, {
              method: "POST",
              headers: {
                // Add authorization header if needed
              },
            })
          );

          await Promise.all(assignPromises);
        }
      }

      notify("User created successfully", "success");
      navigate("/users-dashboard"); // Redirect to users list
    } catch (err) {
      console.error("Error creating user:", err);
      setError("Failed to create user. Please try again.");
      notify("Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Format departments for MultiSelect component
  const departmentOptions = departments.map((dept) => ({
    value: dept.id.toString(),
    text: dept.name,
  }));

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
                <MultiSelect
                  label="Assign to Departments"
                  options={departmentOptions}
                  onChange={setSelectedDepartments}
                  defaultSelected={[]}
                />
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
