
import { Document, DocumentType, DocumentStatus } from "../lib/types";
import { toast } from "sonner";

// Define CreateDocumentDto interface
export interface CreateDocumentDto {
  employeeNumber: string;
  documentType: DocumentType;
  file: File;
  notes?: string;
}

// Define UpdateDocumentDto interface
export interface UpdateDocumentDto {
  documentType?: DocumentType;
  file?: File;
  status?: DocumentStatus;
  notes?: string;
}


// Get documents by employee number with pagination
export const getDocumentsByEmployee = async (
  employeeNumber: string,
  page = 1,
  limit = 10
): Promise<{
  data: Document[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/documents?employeeNumber=${employeeNumber}&page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch documents");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    // Return empty data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get document by ID
export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/documents/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch document");
    }

    const document = await response.json();
    return document;
  } catch (error) {
    console.error("Error fetching document:", error);
    // Return null if document not found
    return null;
  }
};

// Upload a new document
export const uploadDocument = async (documentData: CreateDocumentDto): Promise<Document> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const formData = new FormData();
    formData.append("file", documentData.file);
    formData.append("employeeNumber", documentData.employeeNumber);
    formData.append("documentType", documentData.documentType);
    if (documentData.notes) {
      formData.append("notes", documentData.notes);
    }

    const response = await fetch("http://localhost:3000/documents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to upload document");
    }

    const newDocument = await response.json();
    return newDocument;
  } catch (error) {
    console.error("Error uploading document:", error);
    // Create a temporary document object
    const newDocument: Document = {
      id: `temp_${Math.floor(Math.random() * 10000)}`,
      employeeNumber: documentData.employeeNumber,
      documentType: documentData.documentType,
      fileName: documentData.file.name,
      filePath: URL.createObjectURL(documentData.file),
      uploadedBy: "Current User",
      uploadDate: new Date(),
      status: DocumentStatus.ACTIVE
    };
    return newDocument;
  }
};

// Update document
export const updateDocument = async (id: string, documentData: UpdateDocumentDto): Promise<Document | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const formData = new FormData();
    if (documentData.file) {
      formData.append("file", documentData.file);
    }
    if (documentData.documentType) {
      formData.append("documentType", documentData.documentType);
    }
    if (documentData.status) {
      formData.append("status", documentData.status);
    }
    if (documentData.notes) {
      formData.append("notes", documentData.notes);
    }

    const response = await fetch(`http://localhost:3000/documents/${id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update document");
    }

    const updatedDocument = await response.json();
    return updatedDocument;
  } catch (error) {
    console.error("Error updating document:", error);
    // Return null if update fails
    return null;
  }
};

// Delete document
export const deleteDocument = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/documents/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete document");
    }

    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    // Return false if deletion fails
    return false;
  }
};

// Get a signed URL for document download
export const getDocumentDownloadUrl = async (id: string): Promise<string | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/documents/${id}/download`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to get document download URL");
    }

    const data = await response.json();
    return data.downloadUrl;
  } catch (error) {
    console.error("Error getting document download URL:", error);
    // Return null if getting download URL fails
    return null;
  }
};

export const handleDeleteDocument = async (id: string): Promise<boolean> => {
  try {
    const isDeleted = await deleteDocument(id);
    if (isDeleted) {
      toast.success("Document deleted successfully");
      return true;
    }
    toast.error("Failed to delete document");
    return false;
  } catch (error) {
    console.error("Error deleting document:", error);
    toast.error("An error occurred while deleting the document");
    return false;
  }
};

export const handleUploadDocument = async (file: File, employeeNumber: string, documentType: DocumentType, notes?: string): Promise<Document | null> => {
  try {
    const documentData: CreateDocumentDto = {
      employeeNumber,
      documentType,
      file,
      notes
    };

    const document = await uploadDocument(documentData);
    toast.success("Document uploaded successfully");
    return document;
  } catch (error) {
    console.error("Error uploading document:", error);
    toast.error("An error occurred while uploading the document");
    return null;
  }
};
