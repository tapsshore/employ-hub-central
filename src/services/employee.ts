
import { Employee, ContractType } from "../lib/types";

// Mock data - In a real implementation, this would be replaced with API calls
const mockEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    employeeNumber: "EMP001",
    phoneNumber: "+1234567890",
    contractStartDate: new Date("2022-01-01"),
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
    contractStartDate: new Date("2022-02-15"),
    contractType: ContractType.CONTRACT,
    contractEndDate: new Date("2023-02-15"),
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
    contractStartDate: new Date("2021-06-10"),
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
    contractStartDate: new Date("2022-03-01"),
    contractType: ContractType.TEMPORARY,
    contractEndDate: new Date("2022-09-01"),
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
    contractStartDate: new Date("2021-11-15"),
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
      contractStartDate: emp.contractStartDate ? new Date(emp.contractStartDate) : new Date(),
      contractEndDate: emp.contractEndDate ? new Date(emp.contractEndDate) : undefined,
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
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const employee = mockEmployees.find(e => e.id === id);
      resolve(employee || null);
    }, 300);
  });
};

// Create a new employee
export const createEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmployee: Employee = {
        ...employee,
        id: `EMP${Math.floor(Math.random() * 10000)}`
      };
      mockEmployees.push(newEmployee);
      resolve(newEmployee);
    }, 500);
  });
};

// Update employee
export const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<Employee | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees[index] = { ...mockEmployees[index], ...employeeData };
        resolve(mockEmployees[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

// Delete employee (soft delete in a real implementation)
export const deleteEmployee = async (id: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
