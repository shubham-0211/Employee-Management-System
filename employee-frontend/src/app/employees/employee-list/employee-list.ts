import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, RouterLink, FormsModule],
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

  // Search and filter properties
  searchTerm = '';
  selectedDepartment = 'ALL';
  selectedStatus = 'ALL';

  // Pagination properties
  currentPage = 1;
  pageSize = 5;

  pageSizeOptions = [5, 10, 20, 50];

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('deleted') === 'true') {
      this.successMessage = 'Employee deleted successfully!';
    }

    this.loadEmployees();
  }

  // Load employees from backend
  loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.currentPage = 1;
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

  // Get unique departments for the department filter
  get departments(): string[] {
    return [
      ...new Set(
        this.employees
          .map(employee => employee.department?.trim())
          .filter((department): department is string => !!department)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }

  // Apply search and filters
  get filteredEmployees(): Employee[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.employees.filter(employee => {

      const fullName =
        `${employee.firstName} ${employee.lastName}`.toLowerCase();

      const matchesSearch =
        !search ||
        fullName.includes(search) ||
        employee.employeeCode.toLowerCase().includes(search) ||
        employee.email.toLowerCase().includes(search);

      const matchesDepartment =
        this.selectedDepartment === 'ALL' ||
        employee.department === this.selectedDepartment;

      const matchesStatus =
        this.selectedStatus === 'ALL' ||
        employee.employmentStatus.toUpperCase() ===
          this.selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }

  // Return employees for the current page
  get paginatedEmployees(): Employee[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.filteredEmployees.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  // Calculate total pages
  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  // Display starting record number
  get startRecord(): number {
    if (this.filteredEmployees.length === 0) {
      return 0;
    }

    return (this.currentPage - 1) * this.pageSize + 1;
  }

  // Display ending record number
  get endRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.filteredEmployees.length
    );
  }

  // Reset pagination when search or filters change
  onFiltersChanged(): void {
    this.currentPage = 1;
  }

  // Clear all search and filter selections
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDepartment = 'ALL';
    this.selectedStatus = 'ALL';
    this.currentPage = 1;
  }

  // Navigate to a specific page
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Change the number of records displayed per page
  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
  }
}