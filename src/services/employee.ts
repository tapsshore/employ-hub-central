import { Employee, ContractType } from "../lib/types";


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
    // Return empty data in case of error
    return {
      data: [],
      total: 0,
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
    // Return null if employee not found
    return null;
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
    // Create a temporary employee object
    const newEmployee: Employee = {
      ...employee,
      id: `temp_${Math.floor(Math.random() * 10000)}`
    };
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
    // Return null if update fails
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
    // Return false if deletion fails
    return false;
  }
};
