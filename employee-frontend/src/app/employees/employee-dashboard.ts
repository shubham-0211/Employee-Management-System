import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { EmployeeService } from '../services/employee.service';
import { Employee } from '../models/employee';

@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.css',
})
export class EmployeeDashboard implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);

  employee: Employee | null = null;

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadOwnProfile();
  }

  loadOwnProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getOwnProfile().subscribe({
      next: (data) => {
        this.employee = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load employee profile:', error);

        this.errorMessage =
          'Unable to load your employee profile. Please try again.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}