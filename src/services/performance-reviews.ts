import { toast } from "sonner";

// Define PerformanceRating enum
export enum PerformanceRating {
  EXCELLENT = 5,
  GOOD = 4,
  SATISFACTORY = 3,
  NEEDS_IMPROVEMENT = 2,
  POOR = 1
}

// Define PerformanceReviewStatus enum
export enum PerformanceReviewStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  ACKNOWLEDGED = "ACKNOWLEDGED"
}

// Define PerformanceReview interface
export interface PerformanceReview {
  id: string;
  employeeId: string;
  reviewerId: string;
  reviewPeriod: string;
  overallRating?: PerformanceRating;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  comments?: string;
  employeeComments?: string;
  reviewDate: string;
  nextReviewDate?: string;
  status: PerformanceReviewStatus;
  createdAt: string;
  updatedAt: string;
}

// Define CreatePerformanceReviewDto interface
export interface CreatePerformanceReviewDto {
  employeeId: string;
  reviewPeriod: string;
  overallRating?: PerformanceRating;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  comments?: string;
  reviewDate: string;
  nextReviewDate?: string;
}


// Create a new performance review
export const createPerformanceReview = async (reviewData: CreatePerformanceReviewDto): Promise<PerformanceReview> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/performance-reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create performance review");
    }

    const newReview = await response.json();
    return newReview;
  } catch (error) {
    console.error("Error creating performance review:", error);
    // Create a temporary review object
    const reviewerId = localStorage.getItem("userId") || "temp_reviewer";
    const newReview: PerformanceReview = {
      ...reviewData,
      id: `temp_${Math.floor(Math.random() * 10000)}`,
      reviewerId,
      status: PerformanceReviewStatus.DRAFT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newReview;
  }
};

// Get all performance reviews with pagination
export const getPerformanceReviews = async (page = 1, limit = 10): Promise<{
  data: PerformanceReview[];
  total: number;
  page: number;
  limit: number;
}> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/performance-reviews?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch performance reviews");
    }

    const data = await response.json();
    return {
      data: data.data,
      total: data.total,
      page,
      limit
    };
  } catch (error) {
    console.error("Error fetching performance reviews:", error);
    // Return empty data
    return {
      data: [],
      total: 0,
      page,
      limit
    };
  }
};

// Get performance review by ID
export const getPerformanceReviewById = async (id: string): Promise<PerformanceReview | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/performance-reviews/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch performance review");
    }

    const review = await response.json();
    return review;
  } catch (error) {
    console.error("Error fetching performance review:", error);
    // Return null if review not found
    return null;
  }
};

// Update performance review status
export const updatePerformanceReviewStatus = async (id: string, status: PerformanceReviewStatus): Promise<PerformanceReview | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/performance-reviews/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update performance review status");
    }

    const updatedReview = await response.json();
    return updatedReview;
  } catch (error) {
    console.error("Error updating performance review status:", error);
    // Return null if update fails
    return null;
  }
};

// Add employee comments to a performance review
export const addEmployeeComments = async (id: string, comments: string): Promise<PerformanceReview | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/performance-reviews/${id}/comments`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ comments })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add employee comments");
    }

    const updatedReview = await response.json();
    return updatedReview;
  } catch (error) {
    console.error("Error adding employee comments:", error);
    // Return null if adding comments fails
    return null;
  }
};

// Get all performance reviews for a specific employee
export const getEmployeePerformanceReviews = async (employeeId: string): Promise<PerformanceReview[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`http://localhost:3000/performance-reviews/employee/${employeeId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch employee performance reviews");
    }

    const reviews = await response.json();
    return reviews;
  } catch (error) {
    console.error("Error fetching employee performance reviews:", error);
    // Return empty array if fetching fails
    return [];
  }
};
