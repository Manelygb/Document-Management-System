import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import FileInput from "../../components/form/input/FileInput";
import Select from "../../components/form/Select";
import api from "../../utils/axios"; // Make sure this is imported

// Configuration flag to toggle between mock data and real API
const USE_MOCK_DATA = false;

// Custom notification function instead of toast
const notify = (message: string, type: 'success' | 'error') => {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // In a real app, you would show a toast notification here
  alert(`${type === 'success' ? 'Success' : 'Error'}: ${message}`);
};

// Mock data for testing
const dummyCategories = [
  { id: 1, name: "Legal Documents" },
  { id: 2, name: "Financial Reports" },
  { id: 3, name: "Contracts" },
  { id: 4, name: "Policies" },
  { id: 5, name: "Procedures" }
];

const dummyDepartments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Human Resources" },
  { id: 5, name: "Operations" }
];

interface Category {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

export default function CreateDocument() {
  const [formData, setFormData] = useState({
    title: "",
    translatedTitle: "",
    categoryId: "",
    departmentId: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 600));
          setCategories(dummyCategories);
        } else {
          const response = await fetch("/api/documents/categories", {
            headers: {
              // Add authorization header if needed
            },
          });
          
          if (!response.ok) {
            throw new Error("Failed to fetch categories");
          }
          
          const data = await response.json();
          setCategories(data);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        notify("Failed to load document categories", "error");
      }
    };
    
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
      }
    };
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 600));
            setCategories(dummyCategories);
            await new Promise(resolve => setTimeout(resolve, 800));
            setDepartments(dummyDepartments);
          } else {
            const [categoriesResponse, departmentsResponse] = await Promise.all([
              api.get("/admin/categories"),
              api.get("/admin/departments")
            ]);
            setCategories(categoriesResponse.data);
            setDepartments(departmentsResponse.data);
          }
        } catch (err) {
          console.error("Error fetching dropdowns:", err);
          notify("Failed to load categories or departments", "error");
        }
      };
    
      fetchData();
    }, []);
    
    

  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!file) {
      setError("Please select a file to upload");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload file to MinIO
      const formDataFile = new FormData();
      formDataFile.append("file", file);

      const uploadResponse = await api.post("/files/upload", formDataFile, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedFileName = uploadResponse.data.filename;
      if (!uploadedFileName) throw new Error("No filename returned");

      // 2. Create document
      const docPayload = {
        title: formData.title,
        translatedTitle: formData.translatedTitle || null,
        s3FileUrl: uploadedFileName,
        categoryId: parseInt(formData.categoryId),
        departmentId: parseInt(formData.departmentId),
      };

      await api.post("/documents", docPayload);

      notify("Document created successfully", "success");
      navigate("/doc-dashboard");
    } catch (err) {
      console.error("Error creating document:", err);
      setError("Failed to create document. Please try again.");
      notify("Failed to create document", "error");
    } finally {
      setLoading(false);
    }
  };

  // Format options for Select components
  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));
  
  const departmentOptions = departments.map((department) => ({
    value: department.id.toString(),
    label: department.name,
  }));

  return (
    <>
      <PageMeta title="Create Document" description="Upload and create a new document" />
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <PageBreadcrumb pageTitle="Create Document" />

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-card dark:border-gray-800 dark:bg-gray-900">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="title">
                  Title <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter document title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="translatedTitle">
                  Translated Title
                </Label>
                <Input
                  type="text"
                  id="translatedTitle"
                  name="translatedTitle"
                  placeholder="Enter translated title (optional)"
                  value={formData.translatedTitle}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="categoryId">
                  Category <span className="text-error-500">*</span>
                </Label>
                <Select
                  options={categoryOptions}
                  placeholder="Select a category"
                  onChange={handleSelectChange("categoryId")}
                  defaultValue={formData.categoryId}
                />
              </div>

              <div>
                <Label htmlFor="departmentId">
                  Department <span className="text-error-500">*</span>
                </Label>
                <Select
                  options={departmentOptions}
                  placeholder="Select a department"
                  onChange={handleSelectChange("departmentId")}
                  defaultValue={formData.departmentId}
                />
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="fileUpload">
                Document File <span className="text-error-500">*</span>
              </Label>
              <FileInput onChange={handleFileChange} />
              {file && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
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
                disabled={loading || !formData.title || !formData.categoryId || !formData.departmentId || !file}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-transparent bg-brand-500 px-5 py-3 font-medium text-white shadow-theme-xs hover:bg-brand-600"
              >
                {loading ? "Creating..." : "Create Document"}
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
