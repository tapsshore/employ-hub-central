import { toast } from "sonner";

// Define PaymentMethod enum
export enum PaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CHECK = "CHECK",
  CASH = "CASH"
}

// Define PayrollStatus enum
export enum PayrollStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  REJECTED = "REJECTED"
}

// Define Payroll interface
export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  overtime?: number;
  bonuses?: number;
  netSalary: number;
  paymentMethod: PaymentMethod;
  bankAccount?: string;
  bankName?: string;
  status: PayrollStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Define CreatePayrollDto interface
export interface CreatePayrollDto {
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
  overtime?: number;
  bonuses?: number;
  paymentMethod: PaymentMethod;
  bankAccount?: string;
  bankName?: string;
  notes?: string;
}


// Create a new payroll record
export const createPayroll = async (payrollData: CreatePayrollDto): Promise<Payroll> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/payroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payrollData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create payroll record");
    }

    const newPayroll = await response.json();
    return newPayroll;
  } catch (error) {
    console.error("Error creating payroll record:", error);
    // Create a temporary payroll object
    const netSalary = payrollData.basicSalary + 
      (payrollData.allowances || 0) + 
      (payrollData.bonuses || 0) + 
      (payrollData.overtime || 0) - 
      (payrollData.deductions || 0);

    const newPayroll: Payroll = {
      ...payrollData,
      id: `temp_${Math.floor(Math.random() * 10000)}`,
      netSalary,
      status: PayrollStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newPayroll;
  }
};

// Get all payroll records with pagination and filtering
export const getPayrolls = async (page = 1, limit = 10, month?: number, year?: number): Promise<{
  data: Payroll[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    let url = `http://localhost:3000/payroll?page=${page}&limit=${limit}`;
    if (month !== undefined) url += `&month=${month}`;
    if (year !== undefined) url += `&year=${year}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch payroll records");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching payroll records:", error);
    // Return empty data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get payroll record by ID
export const getPayrollById = async (id: string): Promise<Payroll | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/payroll/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch payroll record");
    }

    const payroll = await response.json();
    return payroll;
  } catch (error) {
    console.error("Error fetching payroll record:", error);
    // Return null if payroll record not found
    return null;
  }
};

// Update payroll status
export const updatePayrollStatus = async (id: string, status: PayrollStatus): Promise<Payroll | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/payroll/${id}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update payroll status");
    }

    const updatedPayroll = await response.json();
    return updatedPayroll;
  } catch (error) {
    console.error("Error updating payroll status:", error);
    // Return null if update fails
    return null;
  }
};

// Get employee payroll records
export const getEmployeePayroll = async (
  employeeId: string, 
  startMonth: number, 
  startYear: number, 
  endMonth: number, 
  endYear: number
): Promise<Payroll[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const url = `http://localhost:3000/payroll/employee/${employeeId}?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch employee payroll records");
    }

    const payrolls = await response.json();
    return payrolls;
  } catch (error) {
    console.error("Error fetching employee payroll records:", error);
    // Return empty array if fetching fails
    return [];
  }
};

// Get payroll statistics
export const getPayrollStats = async (month: number, year: number): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/payroll/stats?month=${month}&year=${year}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch payroll statistics");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching payroll statistics:", error);
    // Return default values if fetching fails
    return {
      totalPayroll: 0,
      averageSalary: 0,
      employeeCount: 0,
      departmentDistribution: {},
      taxDeductions: 0
    };
  }
};
