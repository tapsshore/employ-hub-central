import { toast } from "sonner";

// Define DashboardStats interface
export interface DashboardStats {
  employeeCount: number;
  departmentCount: number;
  newEmployeesThisMonth: number;
  activeLeaveRequests: number;
  attendanceRate: number;
  upcomingReviews: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  departmentDistribution: Record<string, number>;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    userId: string;
  }>;
}

// Define DepartmentDashboardStats interface
export interface DepartmentDashboardStats {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  managerName?: string;
  attendanceRate: number;
  leaveUtilization: number;
  averagePerformance: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  ageDistribution: {
    under25: number;
    age25to34: number;
    age35to44: number;
    age45to54: number;
    age55plus: number;
  };
  tenureDistribution: {
    lessThan1Year: number;
    oneToThreeYears: number;
    threeToFiveYears: number;
    fiveToTenYears: number;
    moreThanTenYears: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    userId: string;
  }>;
}


// Get dashboard statistics
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/dashboard", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch dashboard statistics");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    // Return default values if fetching fails
    return {
      employeeCount: 0,
      departmentCount: 0,
      newEmployeesThisMonth: 0,
      activeLeaveRequests: 0,
      attendanceRate: 0,
      upcomingReviews: 0,
      genderDistribution: {
        male: 0,
        female: 0,
        other: 0
      },
      departmentDistribution: {},
      recentActivities: []
    };
  }
};

// Get department dashboard statistics
export const getDepartmentDashboardStats = async (departmentId: string): Promise<DepartmentDashboardStats> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/dashboard/department/${departmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch department dashboard statistics");
    }

    const stats = await response.json();
    return stats;
  } catch (error) {
    console.error("Error fetching department dashboard statistics:", error);
    // Return default values if fetching fails
    return {
      departmentId,
      departmentName: "",
      employeeCount: 0,
      attendanceRate: 0,
      leaveUtilization: 0,
      averagePerformance: 0,
      genderDistribution: {
        male: 0,
        female: 0,
        other: 0
      },
      ageDistribution: {
        under25: 0,
        age25to34: 0,
        age35to44: 0,
        age45to54: 0,
        age55plus: 0
      },
      tenureDistribution: {
        lessThan1Year: 0,
        oneToThreeYears: 0,
        threeToFiveYears: 0,
        fiveToTenYears: 0,
        moreThanTenYears: 0
      },
      recentActivities: []
    };
  }
};
