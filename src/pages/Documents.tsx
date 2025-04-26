
import DashboardLayout from "@/components/layout/DashboardLayout";
import DocumentList from "@/components/documents/DocumentList";

const Documents = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Upload, manage, and track all employee-related documents.
          </p>
        </div>
        
        <DocumentList />
      </div>
    </DashboardLayout>
  );
};

export default Documents;
