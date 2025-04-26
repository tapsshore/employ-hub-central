
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document, UserRole } from "@/lib/types";
import { getDocumentsByEmployee, getDocumentDownloadUrl, handleDeleteDocument } from "@/services/document";
import { toast } from "sonner";
import { ViewDocumentModal } from "./ViewDocumentModal";
import DocumentFilters from "./DocumentFilters";
import DocumentTable from "./DocumentTable";

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [employeeNumber, setEmployeeNumber] = useState<string>("EMP001");
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  
  const userRole = localStorage.getItem("userRole") as UserRole || UserRole.EMPLOYEE;
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isHR = userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER;
  
  const canManageDocuments = isAdmin || isHR;

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const fetchedDocuments = await getDocumentsByEmployee(employeeNumber);
        setDocuments(fetchedDocuments);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [employeeNumber]);

  const handleDownload = async (documentId: string) => {
    try {
      const downloadUrl = await getDocumentDownloadUrl(documentId);
      if (downloadUrl) {
        toast.success("Document ready for download", {
          description: "Your download should start automatically.",
        });
        console.log("Download URL:", downloadUrl);
      } else {
        toast.error("Download failed", {
          description: "Document not found or access denied.",
        });
      }
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Download failed", {
        description: "An error occurred while downloading the document.",
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    const success = await handleDeleteDocument(documentId);
    if (success) {
      setDocuments(documents.filter(doc => doc.id !== documentId));
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = selectedType === "all" ? true : doc.documentType === selectedType;
    const matchesStatus = selectedStatus === "all" ? true : doc.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Manage employee documents</CardDescription>
          </div>
          {canManageDocuments && (
            <Button className="bg-hr-primary hover:bg-hr-primary/90">
              Upload Document
            </Button>
          )}
        </div>
        <DocumentFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-primary"></div>
          </div>
        ) : (
          <DocumentTable
            documents={filteredDocuments}
            isAdmin={isAdmin}
            canManageDocuments={canManageDocuments}
            onView={setViewDocument}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />
        )}

        {viewDocument && (
          <ViewDocumentModal
            isOpen={!!viewDocument}
            onClose={() => setViewDocument(null)}
            document={viewDocument}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
