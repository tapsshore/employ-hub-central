
import { Eye, Edit } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Employee, ContractType } from "@/lib/types";

interface EmployeeTableProps {
  employees: Employee[];
  canManageEmployees: boolean;
  isAdmin: boolean;
  onViewEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onEditEmployee?: (employee: Employee) => void;
}

const EmployeeTable = ({
  employees,
  canManageEmployees,
  isAdmin,
  onViewEmployee,
  onDeleteEmployee,
  onEditEmployee,
}: EmployeeTableProps) => {
  const getContractBadgeColor = (contractType: ContractType) => {
    switch (contractType) {
      case ContractType.PERMANENT:
        return "bg-green-100 text-green-800";
      case ContractType.TEMPORARY:
        return "bg-yellow-100 text-yellow-800";
      case ContractType.CONTRACT:
        return "bg-blue-100 text-blue-800";
      default:
        return "";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Contract Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Location</TableHead>
            {canManageEmployees && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={7} 
                className="text-center py-8 text-muted-foreground"
              >
                No employees found
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {employee.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getContractBadgeColor(employee.contractType)}
                  >
                    {employee.contractType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(employee.contractStartDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell>
                  {employee.contractEndDate
                    ? format(new Date(employee.contractEndDate), "dd MMM yyyy")
                    : "-"}
                </TableCell>
                <TableCell>{employee.location}</TableCell>
                {canManageEmployees && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewEmployee(employee)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {onEditEmployee && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditEmployee(employee)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      )}
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => onDeleteEmployee(employee.id)}
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
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
