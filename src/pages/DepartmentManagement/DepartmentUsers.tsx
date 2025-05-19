import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from '../../components/ui/button/Button';
import departmentRepository from '../../repositories/departments/DepartmentRepository';
import { DepartmentUser } from '../../repositories/departments/IDepartmentRepository';

interface Department {
  id: number;
  name: string;
}

interface DisplayUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function DepartmentUsers() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentUsers = async () => {
      if (!departmentId) return;

      try {
        const deptId = parseInt(departmentId);

        // Set department name manually or fetch from backend if available
        setDepartment({ id: deptId, name: `Department ${deptId}` });

        const apiUsers: DepartmentUser[] = await departmentRepository.getUsersByDepartment(deptId);

        const displayUsers: DisplayUser[] = apiUsers.map((user) => {
          const [firstName, ...lastParts] = user.userName.split(" ");
          return {
            id: user.userId,
            firstName: firstName || "-",
            lastName: lastParts.join(" ") || "-",
            email: "-", // If email not provided, use "-"
            role: "USER", // Or derive from backend if available
          };
        });

        setUsers(displayUsers);
      } catch (err) {
        console.error('Error fetching department users:', err);
        alert('Failed to load department users');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentUsers();
  }, [departmentId]);

  const handleRemoveUser = async (userId: number) => {
    if (!departmentId) return;
    if (!window.confirm('Are you sure you want to remove this user from the department?')) return;

    try {
      // TODO: Implement real remove logic if available
      setUsers(users.filter(user => user.id !== userId));
      alert('User removed from department successfully');
    } catch (err) {
      console.error('Error removing user from department:', err);
      alert('Failed to remove user from department');
    }
  };

  const handleAddUser = () => {
    navigate(`/departments/${departmentId}/add-user`);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading department users...</div>;
  }

  if (!department) {
    return <div className="flex justify-center p-8">Department not found</div>;
  }

  return (
    <>
      <PageMeta
        title={`${department.name} Department Users`}
        description={`Users in ${department.name} department`}
      />
      <div className="flex justify-between items-center mb-5">
        <PageBreadcrumb pageTitle={`${department.name} Department Users`} />
        <Button
          onClick={handleAddUser}
          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add User to Department
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title={`Users in ${department.name}`}>
          {users.length === 0 ? (
            <div className="text-center py-8">No users in this department</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-800">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          onClick={() => handleRemoveUser(user.id)}
                          variant="outline"
                          className="text-error-500 hover:text-error-600 border-error-500 hover:border-error-600 dark:border-error-400 dark:text-error-400"
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
