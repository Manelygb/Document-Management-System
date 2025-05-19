import axios from "axios";
import { IDocumentRepository } from "./IDocumentRepository";
import { DocumentCategory } from "./IDocumentRepository";

const API_BASE_URL = "http://localhost:8080";

export class APIDocumentRepository implements IDocumentRepository {
  async createCategory(name: string): Promise<void> {
    try {
      const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

      if (!authToken) {
        throw new Error("Authentication required. Please login first.");
      }

      const response = await axios.post(`${API_BASE_URL}/api/admin/categories`, 
        { name }, 
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("Category creation response:", response.data);
    } catch (error: any) {
      console.error("Failed to create category:", error.response?.data || error.message);
      throw error;
    }
  }
  async fetchDocuments(): Promise<DocumentListItem[]> {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!authToken) {
      throw new Error("Authentication required. Please login first.");
    }

    const response = await axios.get(`${API_BASE_URL}/api/documents`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return response.data;
  }


  async fetchCategories(): Promise<DocumentCategory[]> {
    const authToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (!authToken) {
        throw new Error("Authentication required. Please login first.");
    }

    const response = await axios.get(`${API_BASE_URL}/api/admin/categories`, {
        headers: {
        Authorization: `Bearer ${authToken}`
        }
    });

    return response.data;
  }

}
