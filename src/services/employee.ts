import { Employee, ContractType } from "../lib/types";

// Mock data for fallback - In a real implementation, this would be removed
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    employeeNumber: "EMP001",
    phoneNumber: "+1234567890",
    contractStartDate: "2022-01-01",
    contractType: ContractType.PERMANENT,
    location: "New York",
    position: "Software Developer"
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    employeeNumber: "EMP002",
    phoneNumber: "+1234567891",
    contractStartDate: "2022-02-15",
    contractType: ContractType.CONTRACT,
    contractEndDate: "2023-02-15",
    location: "San Francisco",
    position: "UI/UX Designer"
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    employeeNumber: "EMP003",
    phoneNumber: "+1234567892",
    contractStartDate: "2021-06-10",
    contractType: ContractType.PERMANENT,
    location: "Chicago",
    position: "Project Manager"
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@example.com",
    employeeNumber: "EMP004",
    phoneNumber: "+1234567893",
    contractStartDate: "2022-03-01",
    contractType: ContractType.TEMPORARY,
    contractEndDate: "2022-09-01",
    location: "Boston",
    position: "HR Specialist"
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    employeeNumber: "EMP005",
    phoneNumber: "+1234567894",
    contractStartDate: "2021-11-15",
    contractType: ContractType.PERMANENT,
    location: "Seattle",
    position: "DevOps Engineer"
  }
];

// Get all employees with pagination
export const getEmployees = async (page = 1, limit = 10): Promise<{
  data: Employee[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/employees?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch employees");
    }

    const data = await response.json();

    // Transform the data to match the expected Employee type if needed
    const employees = data.data.map((emp: any) => ({
      id: emp.id,
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      employeeNumber: emp.employeeNumber,
      phoneNumber: emp.phoneNumber,
      contractStartDate: emp.contractStartDate,
      contractEndDate: emp.contractEndDate,
      contractType: emp.contractType || ContractType.PERMANENT,
      location: emp.location || "",
      position: emp.position || ""
    }));

    return {
      data: employees,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    // Fallback to mock data in case of error
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = mockEmployees.slice(startIndex, endIndex);

    return {
      data,
      total: mockEmployees.length,
      page,
      limit
    };
  }
};

// Get employee by ID
export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch employee");
    }

    const employee = await response.json();
    return {
      ...employee,
      contractStartDate: employee.contractStartDate,
      contractEndDate: employee.contractEndDate,
    };
  } catch (error) {
    console.error("Error fetching employee:", error);
    // Fallback to mock data
    return mockEmployees.find(e => e.id === id) || null;
  }
};

// Create a new employee
export const createEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...employee,
        password: "password", // Default password for new employees
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create employee");
    }

    const newEmployee = await response.json();
    return {
      ...newEmployee,
      contractStartDate: newEmployee.contractStartDate,
      contractEndDate: newEmployee.contractEndDate,
    };
  } catch (error) {
    console.error("Error creating employee:", error);
    // Fallback to mock implementation
    const newEmployee: Employee = {
      ...employee,
      id: `EMP${Math.floor(Math.random() * 10000)}`
    };
    mockEmployees.push(newEmployee);
    return newEmployee;
  }
};

// Update employee
export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(employeeData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update employee");
    }

    const updatedEmployee = await response.json();
    return {
      ...updatedEmployee,
      contractStartDate: updatedEmployee.contractStartDate,
      contractEndDate: updatedEmployee.contractEndDate,
    };
  } catch (error) {
    console.error("Error updating employee:", error);
    // Fallback to mock implementation
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmployees[index] = { ...mockEmployees[index], ...employeeData };
      return mockEmployees[index];
    }
    return null;
  }
};

// Delete employee
export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete employee");
    }

    return true;
  } catch (error) {
    console.error("Error deleting employee:", error);
    // Fallback to mock implementation
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      return true;
    }
    return false;
  }
};
