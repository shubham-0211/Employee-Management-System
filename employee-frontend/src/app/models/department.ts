export interface Department {
  id?: number;
  departmentCode: string;
  departmentName: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  assignedEmployeeCount?: number;
  createdAt?: string;
  updatedAt?: string;
}