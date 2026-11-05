export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: number;
  employeeId: number | null;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface UserCreateRequest {
  employeeId: number;
  username: string;
  email: string;
  password: string;
  role: 'HR' | 'EMPLOYEE';
}

export interface UserPasswordResetRequest {
  password: string;
}

export interface UserStatusUpdateRequest {
  status: UserStatus;
}