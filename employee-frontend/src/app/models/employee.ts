export interface Employee {
  id?: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  departmentId?: number;
  jobTitle?: string;
  salary?: number;
  hireDate?: string;
  employmentStatus: string;
}