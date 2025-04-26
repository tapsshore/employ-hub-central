
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeeList from "@/components/employees/EmployeeList";
import DocumentList from "@/components/documents/DocumentList";
import { UserRole } from "@/lib/types";
import { getEmployees } from "@/services/employee";

const Dashboard = () => {
  // In a real implementation, this would come from an auth context or store
  const userRole = localStorage.getItem("userRole") as UserRole || UserRole.EMPLOYEE;
  const [employeeCount, setEmployeeCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const response = await getEmployees(1, 1); // Just need the total count
        setEmployeeCount(response.total);
      } catch (error) {
        console.error("Error fetching employee count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeCount();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your HR Management System dashboard.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Employees</CardDescription>
              <CardTitle className="text-4xl">
                {isLoading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-hr-primary"></div>
                ) : (
                  employeeCount
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                Total employees in the system
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Documents</CardDescription>
              <CardTitle className="text-4xl">53</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +8 since last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Reviews</CardDescription>
              <CardTitle className="text-4xl">3</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                -2 since last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Invitations</CardDescription>
              <CardTitle className="text-4xl">2</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                +1 since last week
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee List Section */}
        {(userRole === UserRole.ADMIN || userRole === UserRole.HR_MANAGER || userRole === UserRole.HR_OFFICER) && (
          <div className="pt-4">
            <EmployeeList />
          </div>
        )}

        {/* Document List Section */}
        <div className="pt-4">
          <DocumentList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
