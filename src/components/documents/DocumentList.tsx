import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Document, DocumentType, DocumentStatus, UserRole } from "@/lib/types";
import { getDocumentsByEmployee, getDocumentDownloadUrl, deleteDocument, uploadDocument } from "@/services/document";
import { format } from "date-fns";
import { toast } from "sonner";
import { ViewDocumentModal } from "./ViewDocumentModal";
import { Eye } from "lucide-react";

const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [employeeNumber, setEmployeeNumber] = useState<string>("EMP001"); // In a real app, this might come from a prop or context
  const [viewDocument, setViewDocument] = useState<Document | null>(null);
  
  // In a real implementation, this would come from an auth context or store
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
        // In a real implementation, this would redirect to the download URL or open in a new tab
        toast.success("Document ready for download", {
          description: "Your download should start automatically.",
        });
        console.log("Download URL:", downloadUrl);
        // window.open(downloadUrl, "_blank");
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

  const getDocumentTypeIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.CONTRACT:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        );
      case DocumentType.LEAVE_FORM:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-green-600"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="m9 16 2 2 4-4" />
          </svg>
        );
      case DocumentType.DISCIPLINARY_REPORT:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-red-600"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-gray-600"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
            <path d="M10 9H8" />
          </svg>
        );
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

  const handleDeleteDocument = async (id: string): Promise<boolean> => {
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

  const handleUploadDocument = async (file: File, documentData: Partial<Document>): Promise<Document | null> => {
    try {
      // In a real implementation, this would upload to a file storage service
      const filePath = URL.createObjectURL(file);
      const document = await uploadDocument({
        ...documentData,
        fileName: file.name,
        filePath,
        status: DocumentStatus.ACTIVE,
      } as Omit<Document, "id" | "uploadDate">);
      
      toast.success("Document uploaded successfully");
      return document;
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("An error occurred while uploading the document");
      return null;
    }
  };

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
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Input
            placeholder="Search by document name or employee number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(DocumentType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(DocumentStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.fileName}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{document.employeeNumber}</div>
                      <div className="text-muted-foreground">{document.uploadedBy}</div>
                    </div>
                  </TableCell>
                  <TableCell>{document.documentType}</TableCell>
                  <TableCell>{document.uploadedBy}</TableCell>
                  <TableCell>
                    {format(new Date(document.uploadDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        document.status === DocumentStatus.ACTIVE
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {document.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewDocument(document)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(document.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 mr-1"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Download
                      </Button>
                      {canManageDocuments && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4"
                            >
                              <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-6" />
                              <polyline points="14 2 14 8 20 8" />
                              <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
                            </svg>
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => handleDeleteDocument(document.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                              </svg>
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
