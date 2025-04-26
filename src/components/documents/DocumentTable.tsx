
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Document, DocumentStatus, UserRole } from "@/lib/types";
import { format } from "date-fns";
import DocumentActions from "./DocumentActions";

interface DocumentTableProps {
  documents: Document[];
  isAdmin: boolean;
  canManageDocuments: boolean;
  onView: (document: Document) => void;
  onDownload: (documentId: string) => void;
  onDelete: (documentId: string) => void;
}

const DocumentTable = ({
  documents,
  isAdmin,
  canManageDocuments,
  onView,
  onDownload,
  onDelete,
}: DocumentTableProps) => {
  return (
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
        {documents.map((document) => (
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
              <DocumentActions
                documentId={document.id}
                canManageDocuments={canManageDocuments}
                isAdmin={isAdmin}
                onView={() => onView(document)}
                onDownload={() => onDownload(document.id)}
                onDelete={() => onDelete(document.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DocumentTable;
