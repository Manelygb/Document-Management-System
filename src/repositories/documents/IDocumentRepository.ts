// IDocumentRepository.ts

export interface DocumentCategory {
  id: number;
  name: string;
}

export interface IDocumentRepository {
  createCategory(name: string): Promise<void>;
  fetchDocuments(): Promise<DocumentListItem[]>;
  fetchCategories(): Promise<DocumentCategory[]>; // ✅ NEW

}


export interface DocumentListItem {
  id: number;
  title: string;
  category: string;
  department: string;
  uploadedBy: string;
  createdAt: string;
}

interface Document {
  id: number;
  title: string;
  translatedTitle?: string;
  categoryName: string;
  departmentName: string;
  userName: string;
  createdAt: string;
  s3FileUrl: string;
}
