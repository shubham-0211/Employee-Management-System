import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  employee: Employee | null = null;

  isLoading = false;
  isDeleting = false;

  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('updated') === 'true') {
      this.successMessage = 'Employee updated successfully!';
    }

    this.loadEmployee();
  }

  loadEmployee(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid employee ID.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(id).subscribe({
      next: (data) => {
        this.employee = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load employee details:', error);

        this.errorMessage =
          error.error?.error || 'Unable to load employee details.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onDeleteEmployee(): void {
    if (!this.employee || this.isDeleting) {
      return;
    }

    const employeeName =
      `${this.employee.firstName} ${this.employee.lastName}`;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employeeName}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.isDeleting = true;
    this.errorMessage = '';

    this.employeeService.deleteEmployee(this.employee.id!).subscribe({
      next: () => {
        this.isDeleting = false;

        this.router.navigate(['/employees'], {
          queryParams: { deleted: 'true' },
        });
      },
      error: (error) => {
        console.error('Failed to delete employee:', error);

        this.errorMessage =
          error.error?.error || 'Unable to delete employee. Please try again.';

        this.isDeleting = false;
        this.cdr.detectChanges();
      },
    });
  }
}