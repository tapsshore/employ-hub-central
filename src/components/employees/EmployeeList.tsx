
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Employee, UserRole } from "@/lib/types";
import { getEmployees, deleteEmployee } from "@/services/employee";
import { toast } from "sonner";
import EmployeeActions from "./EmployeeActions";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeTable from "./EmployeeTable";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const userRole = localStorage.getItem("userRole") as UserRole || UserRole.EMPLOYEE;
  
  const isAdmin = userRole === UserRole.ADMIN;
  const isHR = userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER;
  const canManageEmployees = isAdmin || isHR;

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const response = await getEmployees(currentPage, 10);
        setEmployees(response.data);
        setTotalPages(Math.ceil(response.total / response.limit));
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [currentPage]);

  const handleViewEmployee = (employee: Employee) => {
    console.log("View employee:", employee);
  };

  const handleInviteEmployee = () => {
    console.log("Invite employee clicked");
  };
  
  const handleDeleteEmployee = async (employeeId: string) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(employeeId);
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        toast.success("Employee deleted successfully");
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete employee");
      }
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              Manage your organization's employees
            </CardDescription>
          </div>
          <EmployeeActions 
            userRole={userRole} 
            onInvite={handleInviteEmployee} 
          />
        </div>
        <EmployeeSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hr-primary"></div>
          </div>
        ) : (
          <>
            <EmployeeTable
              employees={filteredEmployees}
              canManageEmployees={canManageEmployees}
              isAdmin={isAdmin}
              onViewEmployee={handleViewEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeList;
