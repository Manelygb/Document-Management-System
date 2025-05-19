import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import MultiSelect from "../../components/form/MultiSelect";
import Button from "../../components/ui/button/Button";
import departmentRepository from "../../repositories/departments/DepartmentRepository";
import { UserRepository } from "../../repositories/users/UserRepository"; 

export default function AddUserToDepartment() {
  const { departmentId } = useParams<{ departmentId: string }>();
  const [users, setUsers] = useState<{ value: string; text: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await UserRepository.getInstance().fetchUsers({ page: 1, per_page: 100 });
        const options = res.data.map((user) => ({
          value: user.id.toString(),
          text: user.name ?? user.fullName ?? `${user.firstName} ${user.lastName}`,
        }));
        setUsers(options);
      } catch (err) {
        console.error("Failed to load users:", err);
        alert("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (selectedIds: string[]) => {
    if (selectedIds.length > 0) {
      const selected = users.find(user => user.value === selectedIds[0]);
      if (selected) {
        setSelectedUser({ id: Number(selected.value), name: selected.text });
      }
    } else {
      setSelectedUser(null);
    }
  };

  const handleSubmit = async () => {
    if (!departmentId || !selectedUser) return;

    try {
      await departmentRepository.assignUserToDepartmentWithName(
        Number(departmentId),
        selectedUser.id,
        selectedUser.name
      );
      alert("User successfully assigned to department");
      navigate(`/departments/${departmentId}/users`);
    } catch (err) {
      console.error("Error assigning user:", err);
      alert("Failed to assign user to department");
    }
  };

  return (
    <>
      <PageMeta title="Assign User to Department" />
      <PageBreadcrumb pageTitle="Assign User to Department" />

      <ComponentCard title="Add User to Department">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <>
            <MultiSelect
              label="Select a User"
              options={users}
              defaultSelected={[]}
              onChange={handleChange}
              closeMenuOnSelect={true}
            />
            {selectedUser && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected: {selectedUser.name}
              </div>
            )}
            <div className="mt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedUser}
                className="bg-brand-500 text-white hover:bg-brand-600"
              >
                Assign User
              </Button>
            </div>
          </>
        )}
      </ComponentCard>
    </>
  );
}
