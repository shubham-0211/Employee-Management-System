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
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './employee-edit.html',
  styleUrl: './employee-edit.css',
})
export class EmployeeEdit implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  employeeId = 0;

  employee: Employee | null = null;

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.employeeId) || this.employeeId <= 0) {
      this.errorMessage = 'Invalid employee ID.';
      return;
    }

    this.loadEmployee();
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

    const updatedEmployee: Employee = {
      ...this.employee,
      employeeCode: this.employee.employeeCode.trim(),
      firstName: this.employee.firstName.trim(),
      lastName: this.employee.lastName.trim(),
      email: this.employee.email.trim(),
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

          // Redirect to the employee details page with a success indicator.
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