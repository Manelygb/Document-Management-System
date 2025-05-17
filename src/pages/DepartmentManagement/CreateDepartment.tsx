import { useState } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

// Configuration flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

// Custom notification function instead of toast
const notify = (message: string, type: "success" | "error") => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // In a real app, you would show a toast notification here
  alert(`${type === "success" ? "Success" : "Error"}: ${message}`);
};

export default function CreateDepartment() {
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (USE_MOCK_DATA) {
        // Simulate API call with delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Log the data that would be sent to the server
        console.log("Creating department with name:", departmentName);
      } else {
        // API call to create department
        const response = await fetch("/api/departments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
          },
          body: JSON.stringify({ name: departmentName }),
        });

        if (!response.ok) {
          throw new Error("Failed to create department");
        }
      }

      notify("Department created successfully", "success");
      navigate("/departments"); // Redirect to departments list
    } catch (err) {
      console.error("Error creating department:", err);
      setError("Failed to create department. Please try again.");
      notify("Failed to create department", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Create Department" description="Create a new department" />
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <PageBreadcrumb pageTitle="Create Department" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-card dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <Label htmlFor="departmentName">
                Department Name <span className="text-error-500">*</span>
              </Label>
              <Input
                type="text"
                id="departmentName"
                placeholder="Enter department name"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="mb-5 rounded-lg bg-error-50 p-4 text-error-500 dark:bg-error-500/10">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={loading || !departmentName.trim()}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-transparent bg-brand-500 px-5 py-3 font-medium text-white shadow-theme-xs hover:bg-brand-600"
              >
                {loading ? "Creating..." : "Create Department"}
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
