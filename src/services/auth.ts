
import { LoginCredentials, AuthResponse, User, UserRole } from "../lib/types";

// Mock data - In a real implementation, this would be replaced with API calls
const mockUsers: User[] = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    employeeNumber: "EMP001",
    phoneNumber: "+1234567890",
    role: UserRole.ADMIN
  },
  {
    id: "2",
    firstName: "HR",
    lastName: "Manager",
    email: "hr@example.com",
    employeeNumber: "EMP002",
    phoneNumber: "+1234567891",
    role: UserRole.HR_MANAGER
  },
  {
    id: "3",
    firstName: "John",
    lastName: "Employee",
    email: "employee@example.com",
    employeeNumber: "EMP003",
    phoneNumber: "+1234567892",
    role: UserRole.EMPLOYEE
  }
];

// Real login function that calls the API
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  console.log("Login attempt:", credentials.email);

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Login failed:", errorData);
      throw new Error(errorData.message || "Invalid email or password");
    }

    const data = await response.json();
    console.log("Login successful");
    return data as AuthResponse;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");

      resolve();
    }, 500);
  });
};

// Check if user is authenticated by verifying token
export const checkAuth = async (): Promise<User | null> => {
  // Simulate API call to validate token and get user data
  return new Promise((resolve) => {
    const token = localStorage.getItem("token");
    if (token) {
      // In a real implementation, decode the token and verify it with the backend
      const userEmail = localStorage.getItem("userEmail");
      const user = mockUsers.find(u => u.email === userEmail);
      resolve(user || null);
    } else {
      resolve(null);
    }
  });
};
