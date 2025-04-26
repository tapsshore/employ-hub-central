
export enum UserRole {
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
  HR_MANAGER = "HR_MANAGER",
  HR_OFFICER = "HR_OFFICER"
}

export enum ContractType {
  PERMANENT = "Permanent",
  TEMPORARY = "Temporary",
  CONTRACT = "Contract"
}

export enum DocumentType {
  CONTRACT = "Contract",
  LEAVE_FORM = "LeaveForm",
  DISCIPLINARY_REPORT = "DisciplinaryReport",
  OTHER = "Other"
}

export enum DocumentStatus {
  ACTIVE = "Active",
  ARCHIVED = "Archived"
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  role: UserRole;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeNumber: string;
  phoneNumber: string;
  contractStartDate: Date;
  contractEndDate?: Date;
  contractType: ContractType;
  location: string;
  position: string;
}

export interface Document {
  id: string;
  employeeNumber: string;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  uploadedBy: string;
  uploadDate: Date;
  status: DocumentStatus;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
