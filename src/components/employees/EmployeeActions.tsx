
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/types";

interface EmployeeActionsProps {
  userRole: UserRole;
  onInvite: () => void;
}

const EmployeeActions = ({ userRole, onInvite }: EmployeeActionsProps) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const isHR = userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER;
  const canManageEmployees = isAdmin || isHR;

  if (!canManageEmployees) return null;

  return (
    <div className="flex gap-2">
      <Button 
        variant="outline"
        onClick={onInvite}
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Invite Employee
      </Button>
      <Button className="bg-hr-primary hover:bg-hr-primary/90">
        Add Employee
      </Button>
    </div>
  );
};

export default EmployeeActions;
