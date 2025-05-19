import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import departmentRepository from "../../repositories/departments/DepartmentRepository";

export default function EditDepartment() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If your backend supports "get department by id", call it here
    // For now, assume prefilled value is manually passed or skipped
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await departmentRepository.updateDepartment(Number(departmentId), departmentName);
      alert("Department updated successfully");
      navigate("/departments");
    } catch (err) {
      console.error("Error updating department:", err);
      setError("Failed to update department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Edit Department" description="Edit department details" />
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <PageBreadcrumb pageTitle="Edit Department" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-card dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <Label htmlFor="departmentName">Department Name</Label>
              <Input
                type="text"
                id="departmentName"
                placeholder="Enter new department name"
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

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading || !departmentName.trim()}
                className="bg-brand-500 text-white hover:bg-brand-600"
              >
                {loading ? "Updating..." : "Update Department"}
              </Button>
              <Button
                type="button"
                onClick={() => navigate(-1)}
                variant="outline"
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
