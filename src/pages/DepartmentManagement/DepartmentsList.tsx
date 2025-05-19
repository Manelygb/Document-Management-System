// src/pages/DepartmentManagement/DepartmentsList.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/button/Button';
import departmentRepository from '../../repositories/departments/DepartmentRepository';
import { Department } from '../../repositories/departments/IDepartmentRepository';

export default function DepartmentsList() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentRepository.fetchDepartments();
        setDepartments(data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        alert('Failed to load departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleEdit = (departmentId: number) => {
    navigate(`/departments/edit/${departmentId}`);
  };

  const handleDelete = async (departmentId: number) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;

    try {
      await departmentRepository.deleteDepartment(departmentId);
      setDepartments(prev => prev.filter(dept => dept.id !== departmentId));
      alert('Department deleted successfully');
    } catch (err) {
      console.error('Error deleting department:', err);
      alert('Failed to delete department');
    }
  };

  const handleViewUsers = (departmentId: number) => {
    navigate(`/departments/${departmentId}/users`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading departments...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Department Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Users Count
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {departments.map((department) => (
            <tr key={department.id}>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {department.name}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {department.userCount || 0}
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleViewUsers(department.id)}
                    variant="outline"
                    className="text-blue-500 hover:text-blue-600 border-blue-500 hover:border-blue-600 dark:border-blue-400 dark:text-blue-400"
                  >
                    View Users
                  </Button>
                  <Button
                    onClick={() => handleEdit(department.id)}
                    variant="outline"
                    className="text-brand-500 hover:text-brand-600 border-brand-500 hover:border-brand-600 dark:border-brand-400 dark:text-brand-400"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(department.id)}
                    variant="outline"
                    className="text-error-500 hover:text-error-600 border-error-500 hover:border-error-600 dark:border-error-400 dark:text-error-400"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
