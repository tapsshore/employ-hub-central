
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ViewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: any; // We'll type this properly when we have the actual document structure
}

export const ViewDocumentModal = ({ isOpen, onClose, document }: ViewDocumentModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>View Document</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <iframe
            src={document?.filePath}
            className="w-full h-[600px] border rounded"
            title={document?.fileName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
