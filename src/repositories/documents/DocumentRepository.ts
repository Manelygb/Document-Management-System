// src/repositories/documents/DocumentRepository.ts
import { IDocumentRepository } from "./IDocumentRepository";
import { APIDocumentRepository } from "./APIDocumentRepository";
// import { MockDocumentRepository } from "./MockDocumentRepository"; // optional

const USE_MOCK_DATA = false;

const documentRepository: IDocumentRepository = USE_MOCK_DATA
  ? {} as any // Replace with new MockDocumentRepository() if needed
  : new APIDocumentRepository();

export default documentRepository;
