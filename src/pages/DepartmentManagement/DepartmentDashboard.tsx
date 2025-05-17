import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DepartmentsList from './DepartmentsList';
import Button from '../../components/ui/button/Button';

export default function DepartmentDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta
        title="Department Management"
        description="Manage departments in your organization"
      />
      <div className="flex justify-between items-center mb-5">
        <PageBreadcrumb pageTitle="Department Management" />
        <Button
          onClick={() => navigate('/departments/create')}
          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Department
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Departments List">
          <DepartmentsList />
        </ComponentCard>
      </div>
    </>
  );
}
