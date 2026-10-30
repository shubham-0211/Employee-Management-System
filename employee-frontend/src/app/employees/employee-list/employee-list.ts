import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.css',
})
export class EmployeeList implements OnInit {

  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  employees: Employee[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('deleted') === 'true') {
      this.successMessage = 'Employee deleted successfully!';
    }

    this.loadEmployees();
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
          'Unable to load employees. Please check that the backend is running.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}