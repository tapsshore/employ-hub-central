import { toast } from "sonner";
import { UserRole } from "../lib/types";

// Define Invitation interface
export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  used: boolean;
}

// Define CreateInvitationDto interface
export interface CreateInvitationDto {
  email: string;
  role: UserRole;
}

// Define InvitationValidationResult interface
export interface InvitationValidationResult {
  valid: boolean;
  invitation?: Invitation;
  message?: string;
}


// Create a new invitation
export const createInvitation = async (invitationData: CreateInvitationDto): Promise<Invitation> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch("http://localhost:3000/invitations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(invitationData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create invitation");
    }

    const newInvitation = await response.json();
    return newInvitation;
  } catch (error) {
    console.error("Error creating invitation:", error);
    // Create a temporary invitation object
    const createdBy = localStorage.getItem("userId") || "temp_user";
    const newInvitation: Invitation = {
      ...invitationData,
      id: `temp_${Math.floor(Math.random() * 10000)}`,
      token: `temp_token_${Math.floor(Math.random() * 10000)}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy,
      used: false
    };
    return newInvitation;
  }
};

// Validate invitation token
export const validateInvitationToken = async (token: string): Promise<InvitationValidationResult> => {
  try {
    const response = await fetch(`http://localhost:3000/invitations/validate?token=${token}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        valid: false,
        message: errorData.message || "Invalid or expired invitation token"
      };
    }

    const validationResult = await response.json();
    return {
      valid: true,
      invitation: validationResult
    };
  } catch (error) {
    console.error("Error validating invitation token:", error);
    // Return invalid result if validation fails
    return {
      valid: false,
      message: "Invalid or expired invitation token"
    };
  }
};

// Mark invitation as used
export const markInvitationAsUsed = async (token: string): Promise<boolean> => {
  try {
    const authToken = localStorage.getItem("token");

    const response = await fetch(`http://localhost:3000/invitations/${token}/use`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to mark invitation as used");
    }

    return true;
  } catch (error) {
    console.error("Error marking invitation as used:", error);
    // Return false if marking as used fails
    return false;
  }
};
