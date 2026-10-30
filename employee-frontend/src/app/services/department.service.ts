import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Department } from '../models/department';
import { Employee } from '../models/employee';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/departments';
  private readonly employeeApiUrl = 'http://localhost:8080/api/employees';

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/${id}`);
  }

  getEmployeesByDepartment(departmentId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${this.employeeApiUrl}/department/${departmentId}`,
    );
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }

  updateDepartment(
    id: number,
    department: Department,
  ): Observable<Department> {
    return this.http.put<Department>(
      `${this.apiUrl}/${id}`,
      department,
    );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}