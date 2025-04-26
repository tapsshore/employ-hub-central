import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Employee } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ViewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onEdit?: (employee: Employee) => void;
}

export function ViewEmployeeModal({
  isOpen,
  onClose,
  employee,
  onEdit,
}: ViewEmployeeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
          <DialogDescription>
            View detailed information about this employee.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{employee.position}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Employee Number</h4>
              <p>{employee.employeeNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p>{employee.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Phone Number</h4>
              <p>{employee.phoneNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Location</h4>
              <p>{employee.location}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium">Contract Type</h4>
            <Badge
              variant="outline"
              className={
                employee.contractType === "Permanent"
                  ? "bg-green-100 text-green-800"
                  : employee.contractType === "Temporary"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }
            >
              {employee.contractType}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Start Date</h4>
              <p>{format(new Date(employee.contractStartDate), "dd MMM yyyy")}</p>
            </div>
            {employee.contractEndDate && (
              <div>
                <h4 className="text-sm font-medium">End Date</h4>
                <p>
                  {format(new Date(employee.contractEndDate), "dd MMM yyyy")}
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => onEdit(employee)}
              className="mr-auto"
            >
              Edit
            </Button>
          )}
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}