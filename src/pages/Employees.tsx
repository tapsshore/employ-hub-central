
import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeeList from "@/components/employees/EmployeeList";

const Employees = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage employee records, contracts, and information.
          </p>
        </div>
        
        <EmployeeList />
      </div>
    </DashboardLayout>
  );
};

export default Employees;
