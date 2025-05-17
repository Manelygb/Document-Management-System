import { useNavigate } from "react-router-dom";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocList from "./DocumentsList";
import { MetricCard } from "../../components/ecommerce/EcommerceMetrics";
import { metricsData } from "./docData";
import Button from "../../components/ui/button/Button";

export default function DocumentsDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Documents Dashboard"
        description="Manage your document repository"
      />
      <div className="flex flex-wrap justify-between items-center mb-5">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">Documents Dashboard</h2>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => navigate('/create-document')}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Document
          </Button>
          <Button
            onClick={() => navigate('/create-category')}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 mb-6">
        {metricsData.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      <div className="rounded-lg bg-white dark:bg-gray-900">
        <div className="p-1">
          <DocList />
        </div>
      </div>
    </>
  );
}
