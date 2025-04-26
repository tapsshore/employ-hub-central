
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

// For demonstration purposes - use a simple login function
// In a real implementation, this would make an API call to an authentication endpoint
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { email, password } = credentials;
      
      // Find user by email
      const user = mockUsers.find(u => u.email === email);
      
      // Check if user exists and password is correct (mock validation)
      if (user && password === "password") {
        resolve({
          user,
          token: "mock_jwt_token",
          refreshToken: "mock_refresh_token"
        });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000); // Simulate network delay
  });
};

export const logout = async (): Promise<void> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
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
