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
  selector: 'app-employee-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);

  employees: Employee[] = [];
  recentEmployees: Employee[] = [];

  isLoading = false;
  errorMessage = '';

  totalEmployees = 0;
  activeEmployees = 0;
  totalDepartments = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;

        this.totalEmployees = data.length;

        this.activeEmployees = data.filter(
          (employee) =>
            employee.employmentStatus.toUpperCase() === 'ACTIVE'
        ).length;

        this.totalDepartments = new Set(
          data
            .map((employee) => employee.department?.trim())
            .filter((department) => !!department)
        ).size;

        this.recentEmployees = [...data]
          .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
          .slice(0, 5);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load dashboard data:', error);

        this.errorMessage =
          'Unable to load dashboard data. Please check that the backend is running.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}