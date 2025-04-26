
import { Document, DocumentType, DocumentStatus } from "../lib/types";

// Mock data - In a real implementation, this would be replaced with API calls
const mockDocuments: Document[] = [
  {
    id: "doc1",
    employeeNumber: "EMP001",
    documentType: DocumentType.CONTRACT,
    fileName: "employment_contract.pdf",
    filePath: "/documents/employment_contract.pdf",
    uploadedBy: "HR Manager",
    uploadDate: new Date("2022-01-05"),
    status: DocumentStatus.ACTIVE
  },
  {
    id: "doc2",
    employeeNumber: "EMP001",
    documentType: DocumentType.LEAVE_FORM,
    fileName: "annual_leave_request.pdf",
    filePath: "/documents/annual_leave_request.pdf",
    uploadedBy: "John Doe",
    uploadDate: new Date("2022-06-15"),
    status: DocumentStatus.ACTIVE
  },
  {
    id: "doc3",
    employeeNumber: "EMP002",
    documentType: DocumentType.CONTRACT,
    fileName: "contract_agreement.pdf",
    filePath: "/documents/contract_agreement.pdf",
    uploadedBy: "HR Manager",
    uploadDate: new Date("2022-02-20"),
    status: DocumentStatus.ACTIVE
  },
  {
    id: "doc4",
    employeeNumber: "EMP003",
    documentType: DocumentType.OTHER,
    fileName: "performance_review.pdf",
    filePath: "/documents/performance_review.pdf",
    uploadedBy: "Project Manager",
    uploadDate: new Date("2021-12-10"),
    status: DocumentStatus.ARCHIVED
  },
  {
    id: "doc5",
    employeeNumber: "EMP004",
    documentType: DocumentType.DISCIPLINARY_REPORT,
    fileName: "incident_report.pdf",
    filePath: "/documents/incident_report.pdf",
    uploadedBy: "HR Officer",
    uploadDate: new Date("2022-04-05"),
    status: DocumentStatus.ACTIVE
  }
];

// Get documents by employee number
export const getDocumentsByEmployee = async (employeeNumber: string): Promise<Document[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const documents = mockDocuments.filter(doc => doc.employeeNumber === employeeNumber);
      resolve(documents);
    }, 500);
  });
};

// Get document by ID
export const getDocumentById = async (id: string): Promise<Document | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = mockDocuments.find(doc => doc.id === id);
      resolve(document || null);
    }, 300);
  });
};

// Upload a new document
export const uploadDocument = async (document: Omit<Document, "id" | "uploadDate">): Promise<Document> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDocument: Document = {
        ...document,
        id: `doc${Math.floor(Math.random() * 10000)}`,
        uploadDate: new Date()
      };
      mockDocuments.push(newDocument);
      resolve(newDocument);
    }, 800);
  });
};

// Update document
export const updateDocument = async (id: string, documentData: Partial<Document>): Promise<Document | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDocuments.findIndex(doc => doc.id === id);
      if (index !== -1) {
        mockDocuments[index] = { ...mockDocuments[index], ...documentData };
        resolve(mockDocuments[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Delete document
export const deleteDocument = async (id: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDocuments.findIndex(doc => doc.id === id);
      if (index !== -1) {
        mockDocuments.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

// Get a signed URL for document download (in a real implementation, this would generate a temporary URL)
export const getDocumentDownloadUrl = async (id: string): Promise<string | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const document = mockDocuments.find(doc => doc.id === id);
      if (document) {
        // In a real implementation, this would generate a signed URL with an expiry
        resolve(`https://example.com/api/documents/download/${id}?token=mock_signed_token`);
      } else {
        resolve(null);
      }
    }, 300);
  });
};
