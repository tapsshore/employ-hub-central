
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContractType, Employee } from "@/lib/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { EmployeeForm } from "./EmployeeForm";

interface UpdateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
  onUpdateEmployee: (employeeId: string, employeeData: Partial<Employee>) => Promise<void>;
}

export function UpdateEmployeeModal({
  isOpen,
  onClose,
  employee,
  onUpdateEmployee,
}: UpdateEmployeeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    employeeNumber: "",
    phoneNumber: "",
    position: "",
    location: "",
    contractType: ContractType.PERMANENT,
    contractStartDate: "",
    contractEndDate: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        employeeNumber: employee.employeeNumber,
        phoneNumber: employee.phoneNumber,
        contractType: employee.contractType,
        location: employee.location,
        position: employee.position,
        contractStartDate: employee.contractStartDate,
        contractEndDate: employee.contractEndDate || "",
      });
    }
  }, [employee]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onUpdateEmployee(employee.id, formData);
      toast.success("Employee updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Employee</DialogTitle>
            <DialogDescription>
              Update the details for {employee.firstName} {employee.lastName}.
            </DialogDescription>
          </DialogHeader>
          
          <EmployeeForm 
            formData={formData}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Employee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
