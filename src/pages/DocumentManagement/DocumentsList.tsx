import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableCell, 
  TableBody 
} from "../../components/ui/table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import FilterDropdown from "../../components/ui/dropdown/filterDropdown";
import api from "../../utils/axios"; // top of file

interface Document {
  id: number;
  title: string;
  translatedTitle?: string;
  categoryName: string;
  departmentName: string;
  uploadedBy: string;
  uploadDate: string;
  s3fileUrl: string;
}

export default function DocList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [filters, setFilters] = useState({
    category: "",
    department: "",
    startDate: "",
    endDate: "",
  });
  
  // Configuration flag to toggle between mock data and real API
  const USE_MOCK_DATA = false;
  
  // Mock data for documents
  const dummyDocuments: Document[] = [
    {
      id: 1,
      title: "Annual Financial Report 2023",
      translatedTitle: "Rapport Financier Annuel 2023",
      categoryName: "Financial Reports",
      departmentName: "Finance",
      uploadedBy: "Jane Smith",
      uploadDate: "2023-12-15",
      s3fileUrl: "https://example.com/files/annual-report-2023.pdf"
    },
    {
      id: 2,
      title: "Employee Handbook",
      categoryName: "Policies",
      departmentName: "Human Resources",
      uploadedBy: "John Doe",
      uploadDate: "2023-10-05",
      s3fileUrl: "https://example.com/files/employee-handbook.pdf"
    },
    {
      id: 3,
      title: "Marketing Strategy 2024",
      categoryName: "Strategies",
      departmentName: "Marketing",
      uploadedBy: "Alice Johnson",
      uploadDate: "2023-11-20",
      s3fileUrl: "https://example.com/files/marketing-strategy-2024.pptx"
    },
    {
      id: 4,
      title: "Product Development Roadmap",
      translatedTitle: "Feuille de Route du Développement Produit",
      categoryName: "Roadmaps",
      departmentName: "Engineering",
      uploadedBy: "Bob Williams",
      uploadDate: "2023-09-30",
      s3fileUrl: "https://example.com/files/product-roadmap.xlsx"
    },
    {
      id: 5,
      title: "Legal Agreement with Vendor X",
      categoryName: "Contracts",
      departmentName: "Legal",
      uploadedBy: "Carol Brown",
      uploadDate: "2023-08-12",
      s3fileUrl: "https://example.com/files/vendor-x-agreement.docx"
    }
  ];
  
  // Mock filter options
  const categoryOptions = [
    { label: "All Categories", value: "" },
    { label: "Financial Reports", value: "1" },
    { label: "Policies", value: "2" },
    { label: "Strategies", value: "3" },
    { label: "Roadmaps", value: "4" },
    { label: "Contracts", value: "5" }
  ];
  
  const departmentOptions = [
    { label: "All Departments", value: "" },
    { label: "Finance", value: "1" },
    { label: "Human Resources", value: "2" },
    { label: "Marketing", value: "3" },
    { label: "Engineering", value: "4" },
    { label: "Legal", value: "5" }
  ];
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (USE_MOCK_DATA) {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Filter the dummy data based on filters
          let filteredDocs = [...dummyDocuments];
          
          if (filters.category) {
            const categoryName = categoryOptions.find(c => c.value === filters.category)?.label;
            if (categoryName && categoryName !== "All Categories") {
              filteredDocs = filteredDocs.filter(doc => doc.categoryName === categoryName);
            }
          }
          
          if (filters.department) {
            const departmentName = departmentOptions.find(d => d.value === filters.department)?.label;
            if (departmentName && departmentName !== "All Departments") {
              filteredDocs = filteredDocs.filter(doc => doc.departmentName === departmentName);
            }
          }
          
          if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            filteredDocs = filteredDocs.filter(doc => new Date(doc.uploadDate) >= startDate);
          }
          
          if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // Set to end of day
            filteredDocs = filteredDocs.filter(doc => new Date(doc.uploadDate) <= endDate);
          }
          
          setDocuments(filteredDocs);
        } else {
          const response = await api.post("/documents/search", {
            title: "", // You can extend this to support title search
            categoryId: filters.category ? parseInt(filters.category) : null,
            departmentId: filters.department ? parseInt(filters.department) : null,
            startDate: filters.startDate || null,
            endDate: filters.endDate || null,
          });

          
          setDocuments(response.data);

        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Failed to load documents. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [filters]);
  
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const fileNameOnly = fileUrl.split("/").pop();
  
      const response = await api.get(`/files/download/${fileNameOnly}`, {
        responseType: "blob",
      });
  
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName || fileNameOnly!;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Download failed.");
    }
  };
  
  // Let's redesign the table completely to match the screenshot

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <h4 className="font-semibold text-gray-800 dark:text-white/90">
          Documents
        </h4>
        
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            options={categoryOptions}
            selectedValue={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
            placeholder="Filter by Category"
          />
          
          <FilterDropdown
            options={departmentOptions}
            selectedValue={filters.department}
            onChange={(value) => handleFilterChange("department", value)}
            placeholder="Filter by Department"
          />
          
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
            <span className="text-gray-500 dark:text-gray-400">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm text-gray-800 shadow-theme-xs dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          
          {(filters.category || filters.department || filters.startDate || filters.endDate) && (
            <Button
              size="sm"
              variant="outline"
              onClick={clearFilters}
              className="h-11 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center p-8">Loading documents...</div>
        ) : error ? (
          <div className="rounded-lg bg-error-50 p-4 text-error-500 dark:bg-error-500/10">
            {error}
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="w-6 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No documents found
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white/90">
                          {doc.title}
                        </p>
                        {doc.translatedTitle && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc.translatedTitle}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {doc.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {doc.departmentName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {doc.uploadedBy}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-300">
                      {new Date(doc.uploadDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleDownload(doc.s3fileUrl, doc.title)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                          title="Download"
                        >
                          <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M10 1.5V12.5M10 12.5L6.5 9M10 12.5L13.5 9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 15.5V17C3 18.1046 3.89543 19 5 19H15C16.1046 19 17 18.1046 17 17V15.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <Link to={`/doc-details?id=${doc.id}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
                          <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M10 4.37508C4.16669 4.37508 1.66669 10.0001 1.66669 10.0001C1.66669 10.0001 4.16669 15.6251 10 15.6251C15.8334 15.6251 18.3334 10.0001 18.3334 10.0001C18.3334 10.0001 15.8334 4.37508 10 4.37508Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

