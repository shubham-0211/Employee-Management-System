import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { DepartmentService } from '../services/department.service';
import { Department } from '../models/department';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-department-employees',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './department-employees.html',
  styleUrl: './department-employees.css'
})
export class DepartmentEmployees implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly departmentService = inject(DepartmentService);
  private readonly cdr = inject(ChangeDetectorRef);

  department: Department | null = null;
  employees: Employee[] = [];

  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    const departmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      this.errorMessage = 'Invalid department ID.';
      this.isLoading = false;
      return;
    }

    this.loadDepartmentEmployees(departmentId);
  }

  loadDepartmentEmployees(departmentId: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getDepartmentById(departmentId).subscribe({
      next: (department) => {
        this.department = department;

        this.departmentService.getEmployeesByDepartment(departmentId).subscribe({
          next: (employees) => {
            this.employees = employees;
            this.isLoading = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error loading department employees:', error);
            this.errorMessage = 'Unable to load employees. Please try again.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
      },
      error: (error) => {
        console.error('Error loading department:', error);
        this.errorMessage = 'Department not found or could not be loaded.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  get activeEmployees(): number {
    return this.employees.filter(
      employee => employee.employmentStatus === 'ACTIVE'
    ).length;
  }

  get inactiveEmployees(): number {
    return this.employees.filter(
      employee => employee.employmentStatus !== 'ACTIVE'
    ).length;
  }

  retry(): void {
    const departmentId = Number(this.route.snapshot.paramMap.get('id'));

    if (Number.isInteger(departmentId) && departmentId > 0) {
      this.loadDepartmentEmployees(departmentId);
    }
  }

  goBack(): void {
    this.router.navigate(['/departments']);
  }

  viewEmployee(employee: Employee): void {
    if (employee.id) {
      this.router.navigate(['/employees', employee.id]);
    }
  }
}