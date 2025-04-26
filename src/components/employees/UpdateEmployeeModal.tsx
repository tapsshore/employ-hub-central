import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContractType, Employee } from "@/lib/types";
import { toast } from "sonner";
import { format } from "date-fns";

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
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        id: "",
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        employeeNumber: employee.employeeNumber,
        phoneNumber: employee.phoneNumber,
        contractType: employee.contractType,
        location: employee.location,
        position: employee.position,
        contractStartDate: employee.contractStartDate
            ? format(new Date(employee.contractStartDate), "yyyy-MM-dd")
            : "",
        contractEndDate: employee.contractEndDate
            ? format(new Date(employee.contractEndDate), "yyyy-MM-dd")
            : ""
      });
    }
  }, [employee]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input
                  id="employeeNumber"
                  name="employeeNumber"
                  value={formData.employeeNumber || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractType">Contract Type</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) =>
                  handleSelectChange("contractType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contract type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ContractType.PERMANENT}>
                    Permanent
                  </SelectItem>
                  <SelectItem value={ContractType.TEMPORARY}>
                    Temporary
                  </SelectItem>
                  <SelectItem value={ContractType.CONTRACT}>
                    Contract
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractStartDate">Start Date</Label>
                <Input
                  id="contractStartDate"
                  name="contractStartDate"
                  type="date"
                  value={formData.contractStartDate || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractEndDate">End Date</Label>
                <Input
                  id="contractEndDate"
                  name="contractEndDate"
                  type="date"
                  value={formData.contractEndDate || ""}
                  onChange={handleChange}
                  disabled={formData.contractType === ContractType.PERMANENT}
                />
              </div>
            </div>
          </div>
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