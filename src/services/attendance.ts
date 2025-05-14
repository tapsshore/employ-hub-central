import { toast } from "sonner";

// Define AttendanceType enum
export enum AttendanceType {
  CHECK_IN = "CHECK_IN",
  CHECK_OUT = "CHECK_OUT"
}

// Define AttendanceStatus enum
export enum AttendanceStatus {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
  LATE = "LATE",
  HALF_DAY = "HALF_DAY",
  ON_LEAVE = "ON_LEAVE"
}

// Define Attendance interface
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  time: string;
  type: AttendanceType;
  status: AttendanceStatus;
  location?: string;
  deviceInfo?: string;
  notes?: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define CreateAttendanceDto interface
export interface CreateAttendanceDto {
  date: string;
  time: string;
  type: AttendanceType;
  status?: AttendanceStatus;
  location?: string;
  deviceInfo?: string;
  notes?: string;
}


// Create a new attendance record
export const createAttendance = async (attendanceData: CreateAttendanceDto): Promise<Attendance> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(attendanceData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create attendance record");
    }

    const newAttendance = await response.json();
    return newAttendance;
  } catch (error) {
    console.error("Error creating attendance record:", error);
    // Create a temporary attendance object
    const employeeId = localStorage.getItem("userId") || "temp_user";
    const status = attendanceData.status || 
      (attendanceData.time > "09:00" && attendanceData.type === AttendanceType.CHECK_IN 
        ? AttendanceStatus.LATE 
        : AttendanceStatus.PRESENT);

    const newAttendance: Attendance = {
      ...attendanceData,
      id: `temp_${Math.floor(Math.random() * 10000)}`,
      employeeId,
      status,
      approved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newAttendance;
  }
};

// Get all attendance records with pagination and filtering
export const getAttendance = async (
  page = 1, 
  limit = 10, 
  startDate?: string, 
  endDate?: string
): Promise<{
  data: Attendance[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    let url = `http://localhost:3000/attendance?page=${page}&limit=${limit}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch attendance records");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    // Return empty data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get attendance record by ID
export const getAttendanceById = async (id: string): Promise<Attendance | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/attendance/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch attendance record");
    }

    const attendance = await response.json();
    return attendance;
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    // Return null if attendance record not found
    return null;
  }
};

// Approve attendance record
export const approveAttendance = async (id: string): Promise<Attendance | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/attendance/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to approve attendance record");
    }

    const approvedAttendance = await response.json();
    return approvedAttendance;
  } catch (error) {
    console.error("Error approving attendance record:", error);
    // Return null if approval fails
    return null;
  }
};

// Get employee attendance records
export const getEmployeeAttendance = async (
  employeeId: string, 
  startDate?: string, 
  endDate?: string
): Promise<Attendance[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    let url = `http://localhost:3000/attendance/employee/${employeeId}`;
    if (startDate) url += `?startDate=${startDate}`;
    if (endDate) url += `${startDate ? '&' : '?'}endDate=${endDate}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch employee attendance records");
    }

    const attendance = await response.json();
    return attendance;
  } catch (error) {
    console.error("Error fetching employee attendance records:", error);
    // Return empty array if fetching fails
    return [];
  }
};

// Get attendance statistics
export const getAttendanceStats = async (startDate: string, endDate: string): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/attendance/stats?startDate=${startDate}&endDate=${endDate}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch attendance statistics");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching attendance statistics:", error);
    // Return default values if fetching fails
    return {
      attendanceRate: 0,
      lateRate: 0,
      absentRate: 0,
      averageWorkingHours: 0,
      departmentBreakdown: {}
    };
  }
};
