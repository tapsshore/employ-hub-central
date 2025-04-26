
import { useState } from "react";
import { UserPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";
import { AddEmployeeModal } from "./AddEmployeeModal";
import { createEmployee } from "@/services/employee";

interface EmployeeActionsProps {
  userRole: UserRole;
  onInvite: () => void;
  onEmployeeAdded?: () => void;
}

const EmployeeActions = ({ 
  userRole, 
  onInvite,
  onEmployeeAdded 
}: EmployeeActionsProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const isAdmin = userRole === UserRole.ADMIN;
  const isHR = userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER;
  const canManageEmployees = isAdmin || isHR;

  if (!canManageEmployees) return null;

  const handleAddEmployee = async (employeeData: any) => {
    await createEmployee(employeeData);
    if (onEmployeeAdded) {
      onEmployeeAdded();
    }
  };

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline"
        onClick={onInvite}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite Employee
      </Button>
      <Button 
        className="bg-hr-primary hover:bg-hr-primary/90"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </Button>

      {showAddModal && (
        <AddEmployeeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddEmployee={handleAddEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeActions;
