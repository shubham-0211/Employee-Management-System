
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { DepartmentService } from '../../services/department.service';

import { Employee } from '../../models/employee';
import { Department } from '../../models/department';

@Component({
  selector: 'app-employee-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css',
})
export class EmployeeEdit implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  employeeId = 0;

  employee: Employee | null = null;
  departments: Department[] = [];

  isLoading = false;
  isLoadingDepartments = false;
  isSaving = false;

  errorMessage = '';
  departmentErrorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.employeeId) || this.employeeId <= 0) {
      this.errorMessage = 'Invalid employee ID.';
      return;
    }

    this.loadDepartments();
    this.loadEmployee();
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

  loadEmployee(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (data) => {
        this.employee = { ...data };

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load employee:', error);

        this.errorMessage =
          error.error?.error || 'Unable to load employee details.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onUpdateEmployee(): void {
    if (!this.employee || this.isSaving) {
      return;
    }

    this.formErrorMessage = '';
    this.successMessage = '';

    if (!this.employee.departmentId) {
      this.formErrorMessage = 'Please select a department.';
      return;
    }

    if (
      this.employee.employmentStatus !== 'TERMINATED' &&
      this.employee.employmentStatus !== 'ACTIVE' &&
      this.employee.employmentStatus !== 'INACTIVE' &&
      this.employee.employmentStatus !== 'ON_LEAVE'
    ) {
      this.formErrorMessage = 'Please select a valid employment status.';
      return;
    }

    if (
      this.employee.employmentStatus === 'TERMINATED' &&
      !this.employee.terminationDate
    ) {
      this.formErrorMessage =
        'Termination date is required for terminated employees.';
      return;
    }

    if (
      this.employee.employmentStatus === 'TERMINATED' &&
      !this.employee.exitReason?.trim()
    ) {
      this.formErrorMessage =
        'Exit reason is required for terminated employees.';
      return;
    }

    if (
      this.employee.employmentStatus === 'TERMINATED' &&
      this.employee.terminationDate &&
      this.employee.terminationDate > this.getMaxTerminationDate()
    ) {
      this.formErrorMessage =
        'Termination date cannot be in the future.';
      return;
    }

    if (
      this.employee.employmentStatus === 'TERMINATED' &&
      this.employee.terminationDate &&
      this.employee.hireDate &&
      this.employee.terminationDate < this.employee.hireDate
    ) {
      this.formErrorMessage =
        'Termination date cannot be before the hire date.';
      return;
    }

    if (this.employee.employmentStatus !== 'TERMINATED') {
      if (
        this.employee.terminationDate ||
        this.employee.exitReason?.trim()
      ) {
        this.formErrorMessage =
          'Termination details are allowed only for terminated employees.';
        return;
      }
    }

    const updatedEmployee: Employee = {
      ...this.employee,
      employeeCode: this.employee.employeeCode.trim(),
      firstName: this.employee.firstName.trim(),
      lastName: this.employee.lastName.trim(),
      email: this.employee.email.trim(),
      departmentId: Number(this.employee.departmentId),
      terminationDate: this.employee.terminationDate || null,
      exitReason: this.employee.exitReason?.trim() || null,
    };

    this.isSaving = true;

    this.employeeService
      .updateEmployee(this.employeeId, updatedEmployee)
      .subscribe({
        next: (data) => {
          this.employee = data;
          this.isSaving = false;

          this.successMessage = 'Employee updated successfully!';

          this.cdr.detectChanges();

          this.router.navigate(['/employees', this.employeeId], {
            queryParams: { updated: 'true' },
          });
        },
        error: (error) => {
          console.error('Failed to update employee:', error);

          this.formErrorMessage =
            error.error?.error ||
            'Unable to update employee. Please check the details.';

          this.isSaving = false;
          this.cdr.detectChanges();
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/employees', this.employeeId]);
  }
}
