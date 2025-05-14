import { toast } from "sonner";

// Define Leave type enum
export enum LeaveType {
  ANNUAL = "ANNUAL",
  SICK = "SICK",
  MATERNITY = "MATERNITY",
  PATERNITY = "PATERNITY",
  UNPAID = "UNPAID",
  OTHER = "OTHER"
}

// Define Leave status enum
export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

// Define Leave interface
export interface Leave {
  id: string;
  employeeNumber: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

// Define CreateLeaveDto interface
export interface CreateLeaveDto {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}


// Create a new leave request
export const createLeave = async (leaveData: CreateLeaveDto): Promise<Leave> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/leaves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(leaveData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create leave request");
    }

    const newLeave = await response.json();
    return newLeave;
  } catch (error) {
    console.error("Error creating leave request:", error);
    // Create a temporary leave object
    const employeeNumber = localStorage.getItem("employeeNumber") || "temp_employee";
    const newLeave: Leave = {
      ...leaveData,
      id: `temp_${Math.floor(Math.random() * 10000)}`,
      employeeNumber,
      status: LeaveStatus.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newLeave;
  }
};

// Get all leaves with pagination
export const getLeaves = async (page = 1, limit = 10): Promise<{
  data: Leave[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/leaves?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch leaves");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching leaves:", error);
    // Return empty data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get leave by ID
export const getLeaveById = async (id: string): Promise<Leave | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/leaves/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch leave");
    }

    const leave = await response.json();
    return leave;
  } catch (error) {
    console.error("Error fetching leave:", error);
    // Return null if leave not found
    return null;
  }
};

// Update leave status
export const updateLeaveStatus = async (id: string, status: LeaveStatus, rejectionReason?: string): Promise<Leave | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/leaves/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status, rejectionReason })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update leave status");
    }

    const updatedLeave = await response.json();
    return updatedLeave;
  } catch (error) {
    console.error("Error updating leave status:", error);
    // Return null if update fails
    return null;
  }
};

// Cancel leave
export const cancelLeave = async (id: string): Promise<Leave | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/leaves/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to cancel leave");
    }

    const cancelledLeave = await response.json();
    return cancelledLeave;
  } catch (error) {
    console.error("Error cancelling leave:", error);
    // Return null if cancellation fails
    return null;
  }
};
