import { toast } from "sonner";

// Define Department interface
export interface Department {
  id: string;
  name: string;
  description?: string;
  code?: string;
  headId?: string;
  parentDepartmentId?: string;
  budget?: number;
  location?: string;
}

// Define CreateDepartmentDto interface
export interface CreateDepartmentDto {
  name: string;
  description?: string;
  code?: string;
  headId?: string;
  parentDepartmentId?: string;
  budget?: number;
  location?: string;
}


// Create a new department
export const createDepartment = async (department: CreateDepartmentDto): Promise<Department> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/departments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(department)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create department");
    }

    const newDepartment = await response.json();
    return newDepartment;
  } catch (error) {
    console.error("Error creating department:", error);
    // Create a temporary department object
    const newDepartment: Department = {
      ...department,
      id: `temp_${Math.floor(Math.random() * 10000)}`
    };
    return newDepartment;
  }
};

// Get all departments with pagination
export const getDepartments = async (page = 1, limit = 10): Promise<{
  data: Department[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/departments?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch departments");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching departments:", error);
    // Return empty data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get department hierarchy
export const getDepartmentHierarchy = async (): Promise<Department[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/departments/hierarchy", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch department hierarchy");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching department hierarchy:", error);
    // Return empty array
    return [];
  }
};

// Get department by ID
export const getDepartmentById = async (id: string): Promise<Department | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/departments/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch department");
    }

    const department = await response.json();
    return department;
  } catch (error) {
    console.error("Error fetching department:", error);
    // Return null if department not found
    return null;
  }
};

// Update department
export const updateDepartment = async (id: string, departmentData: Partial<Department>): Promise<Department | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/departments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(departmentData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update department");
    }

    const updatedDepartment = await response.json();
    return updatedDepartment;
  } catch (error) {
    console.error("Error updating department:", error);
    // Return null if update fails
    return null;
  }
};

// Delete department
export const deleteDepartment = async (id: string): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/departments/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete department");
    }

    return true;
  } catch (error) {
    console.error("Error deleting department:", error);
    // Return false if deletion fails
    return false;
  }
};

// Get department employees
export const getDepartmentEmployees = async (id: string, page = 1, limit = 10): Promise<{
  data: any[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/departments/${id}/employees?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch department employees");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching department employees:", error);
    // Fallback to mock data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get department statistics
export const getDepartmentStats = async (id: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/departments/${id}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch department statistics");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching department statistics:", error);
    // Fallback to mock data
    return {
      employeeCount: 0,
      averageTenure: 0,
      genderDistribution: { male: 0, female: 0, other: 0 },
      attendanceRate: 0,
      leaveUtilization: 0
    };
  }
};
