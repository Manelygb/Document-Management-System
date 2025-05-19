// src/repositories/departments/IDepartmentRepository.ts

export interface Department {
  id: number;
  name: string;
}

export interface IDepartmentRepository {
  createDepartment(name: string): Promise<void>;
  fetchDepartments(): Promise<Department[]>;
  deleteDepartment(id: number): Promise<void>;
  updateDepartment(id: number, name: string): Promise<void>; 
  getUsersByDepartment(departmentId: number): Promise<DepartmentUser[]>;
  assignUserToDepartmentWithName(departmentId: number, userId: number, userName: string): Promise<void>;

}

