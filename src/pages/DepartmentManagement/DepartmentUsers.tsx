import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from '../../components/ui/button/Button';

// Configuration flag to toggle between mock data and real API
const USE_MOCK_DATA = true;

// Mock data for department users
const dummyDepartmentUsers = {
  1: [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', role: 'ADMIN' },
    { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael.j@example.com', role: 'USER' },
    { id: 5, firstName: 'David', lastName: 'Wilson', email: 'david.w@example.com', role: 'USER' }
  ],
  2: [
    { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', role: 'USER' },
    { id: 4, firstName: 'Emily', lastName: 'Brown', email: 'emily.b@example.com', role: 'USER' }
  ]
};

// Mock department data
const dummyDepartments = {
  1: { id: 1, name: 'Engineering' },
  2: { id: 2, name: 'Marketing' },
  3: { id: 3, name: 'Finance' },
  4: { id: 4, name: 'Human Resources' },
  5: { id: 5, name: 'Operations' }
};

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface Department {
  id: number;
  name: string;
}

export default function DepartmentUsers() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentUsers = async () => {
      if (!departmentId) return;
      
      try {
        if (USE_MOCK_DATA) {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Get department info
          const deptId = parseInt(departmentId);
          const deptInfo = dummyDepartments[deptId as keyof typeof dummyDepartments];
          setDepartment(deptInfo || null);
          
          // Get department users
          const deptUsers = dummyDepartmentUsers[deptId as keyof typeof dummyDepartmentUsers] || [];
          setUsers(deptUsers);
        } else {
          // Get department info
          const deptResponse = await fetch(`/documents/departments/${departmentId}`, {
            headers: {
              // Add authorization header if needed
            }
          });
          
          if (!deptResponse.ok) {
            throw new Error('Failed to fetch department');
          }
          
          const deptData = await deptResponse.json();
          setDepartment(deptData);
          
          // Get department users
          const usersResponse = await fetch(`/documents/departments/${departmentId}/users`, {
            headers: {
              // Add authorization header if needed
            }
          });
          
          if (!usersResponse.ok) {
            throw new Error('Failed to fetch department users');
          }
          
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }
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
    if (!window.confirm('Are you sure you want to remove this user from the department?')) {
      return;
    }

    try {
      if (USE_MOCK_DATA) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setUsers(users.filter(user => user.id !== userId));
        alert('User removed from department successfully');
      } else {
        const response = await fetch(`/documents/departments/${departmentId}/users/${userId}`, {
          method: 'DELETE',
          headers: {
            // Add authorization header if needed
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove user from department');
        }
        
        setUsers(users.filter(user => user.id !== userId));
        alert('User removed from department successfully');
      }
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
