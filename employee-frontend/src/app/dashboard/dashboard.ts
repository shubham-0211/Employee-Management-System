import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = false;
  errorMessage = '';

  totalEmployees = 0;
  activeEmployees = 0;
  inactiveEmployees = 0;
  totalDepartments = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.totalEmployees = employees.length;

        this.activeEmployees = employees.filter(
          employee =>
            employee.employmentStatus.toUpperCase() === 'ACTIVE'
        ).length;

        this.inactiveEmployees = employees.filter(
          employee =>
            employee.employmentStatus.toUpperCase() === 'INACTIVE'
        ).length;

        this.totalDepartments = new Set(
          employees
            .map(employee => employee.department?.trim())
            .filter((department): department is string => !!department)
        ).size;

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load HR dashboard:', error);

        this.errorMessage =
          'Unable to load dashboard statistics. Please check the backend connection.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}