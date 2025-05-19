// src/repositories/departments/APIDepartmentRepository.ts
import axios from "axios";
import { Department, IDepartmentRepository } from "./IDepartmentRepository";

const API_BASE_URL = "http://localhost:8080";

export class APIDepartmentRepository implements IDepartmentRepository {
  async createDepartment(name: string): Promise<void> {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!authToken) throw new Error("Authentication required");

    await axios.post(`${API_BASE_URL}/api/admin/departments`, { name }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    });
  }

  async fetchDepartments(): Promise<Department[]> {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!authToken) throw new Error("Authentication required");

    const response = await axios.get(`${API_BASE_URL}/api/admin/departments`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    });

    return response.data; // assume response is already an array of departments
  }

  async updateDepartment(id: number, name: string): Promise<void> {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required");

    await axios.put(`${API_BASE_URL}/api/admin/departments/${id}`, 
        { name }, 
        {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
        }
    );
    }

  async deleteDepartment(id: number): Promise<void> {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required");
    await axios.delete(`${API_BASE_URL}/api/admin/departments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  async getUsersByDepartment(departmentId: number): Promise<DepartmentUser[]> {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required");

    const response = await axios.get(
        `${API_BASE_URL}/api/admin/departments/${departmentId}/users`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        }
        }
    );

    return response.data; // [{ userId, userName }]
  }
  async assignUserToDepartmentWithName(departmentId: number, userId: number, userName: string): Promise<void> {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!token) throw new Error("Authentication required");

    await axios.post(`${API_BASE_URL}/api/admin/assign-user-to-departments`, {
        userId,
        userName,
        departmentIds: [departmentId]
    }, {
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
        }
    });
  }



}
