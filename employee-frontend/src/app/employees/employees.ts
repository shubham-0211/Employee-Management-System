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
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employees',
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  employees: Employee[] = [];

  isLoading = false;
  isSaving = false;

  showCreateForm = false;

  errorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  newEmployee: Employee = this.createEmptyEmployee();

  ngOnInit(): void {
    if (window.location.pathname === '/employees/new') {
      this.showCreateForm = true;
    }

    this.loadEmployees();
  }

  createEmptyEmployee(): Employee {
    return {
      employeeCode: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      jobTitle: '',
      salary: undefined,
      hireDate: '',
      employmentStatus: 'ACTIVE',
    };
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

    const employee: Employee = {
      ...this.newEmployee,
      employeeCode: this.newEmployee.employeeCode.trim(),
      firstName: this.newEmployee.firstName.trim(),
      lastName: this.newEmployee.lastName.trim(),
      email: this.newEmployee.email.trim(),
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
}