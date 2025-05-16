import { LoginCredentials, AuthResponse, User, UserRole } from "../lib/types";
import { toast } from "sonner";

// Define RegisterDto interface
export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
  contractStartDate: string;
  contractEndDate?: string;
  contractType: string;
  location: string;
  position: string;
  departmentId?: string;
}

// Define ForgotPasswordDto interface
export interface ForgotPasswordDto {
  email: string;
}

// Define ResetPasswordDto interface
export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// Define Enable2faDto interface
export interface Enable2faDto {
  twoFactorCode: string;
}

// Define Verify2faDto interface
export interface Verify2faDto {
  twoFactorCode: string;
  tempToken: string;
}


// Register a new user
export const register = async (userData: RegisterDto): Promise<AuthResponse> => {
  try {
    const url = "http://localhost:3000/auth/register";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    return data as AuthResponse;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

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

// Refresh access token
export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  try {
    const response = await fetch("http://localhost:3000/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to refresh token");
    }

    const data = await response.json();
    return data as AuthResponse;
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
};

// Request password reset
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await fetch("http://localhost:3000/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to request password reset");
    }

    toast.success("Password reset instructions sent to your email");
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

// Reset password with token
export const resetPassword = async (resetData: ResetPasswordDto): Promise<void> => {
  try {
    const response = await fetch("http://localhost:3000/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to reset password");
    }

    toast.success("Password has been reset successfully");
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.warn("Logout API call failed, but proceeding with local logout");
      }
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of API success
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
  }
};

// Generate 2FA secret and QR code
export const generate2fa = async (): Promise<{ secret: string; qrCodeUrl: string }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/auth/2fa/generate", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate 2FA secret");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("2FA generation error:", error);
    throw error;
  }
};

// Enable 2FA for user
export const enable2fa = async (twoFactorCode: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/auth/2fa/enable", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ twoFactorCode }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to enable 2FA");
    }

    toast.success("Two-factor authentication enabled successfully");
  } catch (error) {
    console.error("Enable 2FA error:", error);
    throw error;
  }
};

// Disable 2FA for user
export const disable2fa = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/auth/2fa/disable", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to disable 2FA");
    }

    toast.success("Two-factor authentication disabled successfully");
  } catch (error) {
    console.error("Disable 2FA error:", error);
    throw error;
  }
};

// Verify 2FA code during login
export const verify2fa = async (twoFactorCode: string, tempToken: string): Promise<AuthResponse> => {
  try {
    const response = await fetch("http://localhost:3000/auth/2fa/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ twoFactorCode, tempToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Invalid verification code");
    }

    const data = await response.json();
    return data as AuthResponse;
  } catch (error) {
    console.error("2FA verification error:", error);
    throw error;
  }
};

// Check if user is authenticated by verifying token
export const checkAuth = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  try {
    // In a real implementation, make an API call to validate the token
    const response = await fetch("http://localhost:3000/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Invalid token");
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Token validation error:", error);
    // Return null if token validation fails
    return null;
  }
};

// Export auth service as an object for easier imports
export const authService = {
  register,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  logout,
  generate2fa,
  enable2fa,
  disable2fa,
  verify2fa,
  checkAuth,
};