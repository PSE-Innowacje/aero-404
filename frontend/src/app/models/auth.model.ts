export type UserRole = 'ADMIN' | 'PLANNER' | 'SUPERVISOR' | 'PILOT';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: UserRole;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  message: string;
  errors: string[];
}
