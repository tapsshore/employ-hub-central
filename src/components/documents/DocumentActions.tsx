
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText } from "lucide-react";
import { UserRole } from "@/lib/types";

interface DocumentActionsProps {
  documentId: string;
  canManageDocuments: boolean;
  isAdmin: boolean;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

const DocumentActions = ({
  documentId,
  canManageDocuments,
  isAdmin,
  onView,
  onDownload,
  onDelete,
}: DocumentActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDownload}
      >
        <Download className="h-4 w-4 mr-1" />
        Download
      </Button>
      {canManageDocuments && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <FileText className="h-4 w-4" />
          </Button>
          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500"
              onClick={onDelete}
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
  );
};

export default DocumentActions;
