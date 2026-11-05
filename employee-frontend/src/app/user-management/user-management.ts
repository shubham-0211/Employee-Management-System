import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { EmployeeService } from '../services/employee.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

import { Employee } from '../models/employee';
import {
  User,
  UserCreateRequest,
  UserRole,
  UserStatus,
} from '../models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly employeeService = inject(EmployeeService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  employees: Employee[] = [];

  isLoading = false;
  isCreating = false;
  isResetting = false;

  errorMessage = '';
  successMessage = '';

  selectedResetUser: User | null = null;

  readonly createUserForm = this.formBuilder.nonNullable.group({
    employeeId: [0, [Validators.required, Validators.min(1)]],
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    role: ['EMPLOYEE' as 'HR' | 'EMPLOYEE', [Validators.required]],
  });

  readonly resetPasswordForm = this.formBuilder.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(12)]],
  });

  ngOnInit(): void {
    this.loadData();
  }

  get availableEmployees(): Employee[] {
    const linkedEmployeeIds = new Set(
      this.users
        .map(user => user.employeeId)
        .filter((id): id is number => id !== null)
    );

    return this.employees.filter(
      employee =>
        employee.employmentStatus.toUpperCase() === 'ACTIVE' &&
        !linkedEmployeeIds.has(employee.id!)
    );
  }

  get activeUsers(): number {
    return this.users.filter(user => user.status === 'ACTIVE').length;
  }

  get inactiveUsers(): number {
    return this.users.filter(user => user.status === 'INACTIVE').length;
  }

  get currentUserId(): number | null {
    return this.authService.getCurrentUser()?.userId ?? null;
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loadEmployees();
      },
      error: error => {
        console.error('Failed to load user accounts:', error);

        this.errorMessage =
          'Unable to load user accounts. Check your permissions and backend connection.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: employees => {
        this.employees = employees;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to load employees:', error);

        this.errorMessage =
          'User accounts loaded, but employee records could not be loaded.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  createUser(): void {
    if (this.createUserForm.invalid || this.isCreating) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    const request: UserCreateRequest =
      this.createUserForm.getRawValue();

    if (!this.availableEmployees.some(
      employee => employee.id === request.employeeId
    )) {
      this.errorMessage =
        'Select an active employee who does not already have an account.';
      return;
    }

    if (new TextEncoder().encode(request.password).length > 72) {
      this.errorMessage =
        'Password cannot exceed 72 UTF-8 bytes.';
      return;
    }

    this.isCreating = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.createUser(request).subscribe({
      next: user => {
        this.users = [...this.users, user];

        this.createUserForm.reset({
          employeeId: 0,
          username: '',
          email: '',
          password: '',
          role: 'EMPLOYEE',
        });

        this.successMessage =
          `Account '${user.username}' created successfully. Share the temporary password securely. The user must change it at first login.`;

        this.isCreating = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to create user account:', error);

        this.errorMessage =
          error.status === 409
            ? 'Username, email, or employee account already exists.'
            : error.status === 400
              ? 'Invalid account details. Check the form values.'
              : 'Unable to create user account. Please try again.';

        this.isCreating = false;
        this.cdr.detectChanges();
      },
    });
  }

  openPasswordReset(user: User): void {
    this.selectedResetUser = user;
    this.resetPasswordForm.reset({ password: '' });
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelPasswordReset(): void {
    this.selectedResetUser = null;
    this.resetPasswordForm.reset({ password: '' });
  }

  resetPassword(): void {
    if (
      !this.selectedResetUser ||
      this.resetPasswordForm.invalid ||
      this.isResetting
    ) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const user = this.selectedResetUser;
    const password = this.resetPasswordForm.controls.password.value;

    if (new TextEncoder().encode(password).length > 72) {
      this.errorMessage = 'Password cannot exceed 72 UTF-8 bytes.';
      return;
    }

    this.isResetting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.resetPassword(user.id, { password }).subscribe({
      next: () => {
        this.selectedResetUser = null;
        this.resetPasswordForm.reset({ password: '' });

        this.successMessage =
          `Password reset successfully for '${user.username}'. The user must change the password at next login.`;

        this.isResetting = false;
        this.cdr.detectChanges();
      },
      error: error => {
        console.error('Failed to reset password:', error);

        this.errorMessage =
          error.status === 404
            ? 'User account was not found.'
            : 'Unable to reset password. Please try again.';

        this.isResetting = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleUserStatus(user: User): void {
    if (user.id === this.currentUserId) {
      this.errorMessage = 'You cannot deactivate your own account.';
      return;
    }

    const newStatus: UserStatus =
      user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} the account '${user.username}'?`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.userService
      .updateUserStatus(user.id, { status: newStatus })
      .subscribe({
        next: updatedUser => {
          this.users = this.users.map(existingUser =>
            existingUser.id === updatedUser.id
              ? updatedUser
              : existingUser
          );

          this.successMessage =
            `Account '${updatedUser.username}' ${newStatus.toLowerCase()} successfully.`;

          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Failed to update user status:', error);

          this.errorMessage =
            error.status === 400
              ? 'This status change is not allowed. Check administrator account restrictions.'
              : 'Unable to update account status. Please try again.';

          this.cdr.detectChanges();
        },
      });
  }

  getEmployeeName(employeeId: number | null): string {
    if (employeeId === null) {
      return '-';
    }

    const employee = this.employees.find(
      item => item.id === employeeId
    );

    return employee
      ? `${employee.firstName} ${employee.lastName}`
      : `Employee #${employeeId}`;
  }
}