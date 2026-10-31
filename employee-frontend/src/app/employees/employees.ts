
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { EmployeeService } from '../services/employee.service';
import { DepartmentService } from '../services/department.service';

import { Employee } from '../models/employee';
import { Department } from '../models/department';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  employees: Employee[] = [];
  departments: Department[] = [];

  isLoading = false;
  isLoadingDepartments = false;
  isSaving = false;

  showCreateForm = false;

  errorMessage = '';
  departmentErrorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  newEmployee: Employee = this.createEmptyEmployee();

  ngOnInit(): void {
    if (window.location.pathname === '/employees/new') {
      this.showCreateForm = true;
    }

    this.loadDepartments();
    this.loadEmployees();
  }

  createEmptyEmployee(): Employee {
    return {
      employeeCode: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: undefined,
      jobTitle: '',
      salary: undefined,
      hireDate: '',
      employmentStatus: 'ACTIVE',
      terminationDate: null,
      exitReason: null,
    };
  }

  getMaxTerminationDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  loadDepartments(): void {
    this.isLoadingDepartments = true;
    this.departmentErrorMessage = '';

    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data.filter(
          department => department.status === 'ACTIVE'
        );

        this.isLoadingDepartments = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load departments:', error);

        this.departmentErrorMessage =
          'Unable to load departments. Please check the backend connection.';

        this.isLoadingDepartments = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load employees:', error);

        this.errorMessage =
          'Unable to load employees. Check that the backend is running.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSaveEmployee(): void {
    this.formErrorMessage = '';
    this.successMessage = '';

    if (this.isSaving) {
      return;
    }

    if (!this.newEmployee.departmentId) {
      this.formErrorMessage = 'Please select a department.';
      return;
    }

    if (this.newEmployee.employmentStatus === 'TERMINATED') {
      if (!this.newEmployee.terminationDate) {
        this.formErrorMessage =
          'Termination date is required for terminated employees.';
        return;
      }

      if (!this.newEmployee.exitReason?.trim()) {
        this.formErrorMessage =
          'Exit reason is required for terminated employees.';
        return;
      }

      if (this.newEmployee.terminationDate > this.getMaxTerminationDate()) {
        this.formErrorMessage =
          'Termination date cannot be in the future.';
        return;
      }

      if (
        this.newEmployee.hireDate &&
        this.newEmployee.terminationDate < this.newEmployee.hireDate
      ) {
        this.formErrorMessage =
          'Termination date cannot be before the hire date.';
        return;
      }
    } else {
      this.newEmployee.terminationDate = null;
      this.newEmployee.exitReason = null;
    }

    const employee: Employee = {
      ...this.newEmployee,
      employeeCode: this.newEmployee.employeeCode.trim(),
      firstName: this.newEmployee.firstName.trim(),
      lastName: this.newEmployee.lastName.trim(),
      email: this.newEmployee.email.trim(),
      departmentId: Number(this.newEmployee.departmentId),
      terminationDate: this.newEmployee.terminationDate || null,
      exitReason: this.newEmployee.exitReason?.trim() || null,
    };

    this.isSaving = true;

    this.employeeService.createEmployee(employee).subscribe({
      next: (createdEmployee) => {
        this.employees = [
          ...this.employees,
          createdEmployee,
        ];

        this.isSaving = false;

        this.successMessage =
          `Employee ${createdEmployee.firstName} ${createdEmployee.lastName} created successfully!`;

        this.newEmployee = this.createEmptyEmployee();

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to create employee:', error);

        this.formErrorMessage =
          error.error?.error ||
          'Unable to create employee. Please check the details and try again.';

        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  onCancelCreate(): void {
    this.formErrorMessage = '';
    this.successMessage = '';
    this.newEmployee = this.createEmptyEmployee();

    this.router.navigate(['/employees']);
  }

  onAddEmployee(): void {
    this.router.navigate(['/employees/new']);
  }
}
