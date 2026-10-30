
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DepartmentService } from '../services/department.service';
import { Department } from '../models/department';

@Component({
  selector: 'app-department-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './department-management.html',
  styleUrl: './department-management.css',
})
export class DepartmentManagement implements OnInit {

  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  departments: Department[] = [];

  department: Department = this.createEmptyDepartment();

  selectedDepartment: Department | null = null;
  showDetails = false;

  isLoading = false;
  isSaving = false;
  isEditing = false;
  showForm = false;

  errorMessage = '';
  formErrorMessage = '';
  successMessage = '';

  // Search and pagination
  searchTerm = '';

  pageSize = 10;
  currentPage = 1;

  readonly pageSizeOptions = [5, 10, 20, 50];

  ngOnInit(): void {
    this.loadDepartments();
  }

  createEmptyDepartment(): Department {
    return {
      departmentCode: '',
      departmentName: '',
      description: '',
      status: 'ACTIVE',
    };
  }

  loadDepartments(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.departmentService.getDepartments().subscribe({
      next: (data) => {
        this.departments = data;
        this.currentPage = 1;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load departments:', error);

        this.errorMessage =
          'Unable to load departments. Please check the backend connection.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Summary counts
  get totalDepartments(): number {
    return this.departments.length;
  }

  get activeDepartments(): number {
    return this.departments.filter(
      (department) => department.status === 'ACTIVE'
    ).length;
  }

  get inactiveDepartments(): number {
    return this.departments.filter(
      (department) => department.status === 'INACTIVE'
    ).length;
  }

  // Search by department code or name
  get filteredDepartments(): Department[] {
    const search = this.searchTerm.trim().toLowerCase();

    return this.departments.filter((department) => {
      return (
        !search ||
        department.departmentCode.toLowerCase().includes(search) ||
        department.departmentName.toLowerCase().includes(search)
      );
    });
  }

  // Default alphabetical sorting
  get sortedDepartments(): Department[] {
    return [...this.filteredDepartments].sort((a, b) =>
      a.departmentName.localeCompare(b.departmentName)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.sortedDepartments.length / this.pageSize);
  }

  get paginatedDepartments(): Department[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;

    return this.sortedDepartments.slice(
      startIndex,
      startIndex + this.pageSize
    );
  }

  get startRecord(): number {
    return this.sortedDepartments.length === 0
      ? 0
      : (this.currentPage - 1) * this.pageSize + 1;
  }

  get endRecord(): number {
    return Math.min(
      this.currentPage * this.pageSize,
      this.sortedDepartments.length
    );
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  // Navigate to department employees page
  viewDepartmentEmployees(department: Department): void {
    if (!department.id) {
      return;
    }

    this.router.navigate([
      '/departments',
      department.id,
      'employees',
    ]);
  }

  // View department details
  openDetails(department: Department): void {
    this.selectedDepartment = { ...department };
    this.showDetails = true;
    this.showForm = false;
    this.cdr.detectChanges();
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedDepartment = null;
    this.cdr.detectChanges();
  }

  // Create department
  openCreateForm(): void {
    this.closeDetails();

    this.department = this.createEmptyDepartment();
    this.isEditing = false;
    this.showForm = true;
    this.formErrorMessage = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Edit department
  openEditForm(department: Department): void {
    const departmentToEdit = { ...department };

    this.showDetails = false;
    this.selectedDepartment = null;

    this.department = departmentToEdit;
    this.isEditing = true;
    this.showForm = true;

    this.formErrorMessage = '';
    this.successMessage = '';
    this.errorMessage = '';

    this.cdr.detectChanges();
  }

  // Save department
  onSaveDepartment(): void {
    if (this.isSaving) {
      return;
    }

    this.formErrorMessage = '';
    this.successMessage = '';

    const request: Department = {
      ...this.department,
      departmentCode: this.department.departmentCode.trim(),
      departmentName: this.department.departmentName.trim(),
      description: this.department.description?.trim() || '',
    };

    this.isSaving = true;

    const operation = this.isEditing && request.id
      ? this.departmentService.updateDepartment(request.id, request)
      : this.departmentService.createDepartment(request);

    operation.subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;

        this.successMessage = this.isEditing
          ? 'Department updated successfully!'
          : 'Department created successfully!';

        this.department = this.createEmptyDepartment();
        this.isEditing = false;

        this.loadDepartments();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to save department:', error);

        this.formErrorMessage =
          error.error?.error ||
          'Unable to save department. Please check the details.';

        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  // Cancel form
  onCancel(): void {
    this.showForm = false;
    this.department = this.createEmptyDepartment();
    this.isEditing = false;
    this.formErrorMessage = '';
  }

  // Delete department
  onDeleteDepartment(department: Department): void {
    if (!department.id || this.isSaving) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete department "${department.departmentName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.formErrorMessage = '';
    this.successMessage = '';
    this.isSaving = true;

    this.departmentService.deleteDepartment(department.id).subscribe({
      next: () => {
        this.isSaving = false;
        this.showForm = false;
        this.isEditing = false;

        this.department = this.createEmptyDepartment();

        this.successMessage =
          `Department "${department.departmentName}" deleted successfully!`;

        this.loadDepartments();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to delete department:', error);

        this.formErrorMessage =
          error.error?.error ||
          'Unable to delete department. Employees may still be assigned to it.';

        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }
}
