import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../services/auth.service';

const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!newPassword || !confirmPassword) {
    return null;
  }

  return newPassword === confirmPassword
    ? null
    : { passwordMismatch: true };
};

const utf8PasswordLengthValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.value as string;

  if (!password) {
    return null;
  }

  const byteLength = new TextEncoder().encode(password).length;

  return byteLength <= 72
    ? null
    : { maxUtf8Bytes: true };
};

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly changePasswordForm = this.formBuilder.nonNullable.group(
    {
      currentPassword: [
        '',
        [Validators.required, utf8PasswordLengthValidator],
      ],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          utf8PasswordLengthValidator,
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: passwordMatchValidator,
    }
  );

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.changePasswordForm.invalid || this.isLoading) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } =
      this.changePasswordForm.getRawValue();

    if (currentPassword === newPassword) {
      this.errorMessage =
        'Your new password must be different from your current password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .changePassword({
        currentPassword,
        newPassword,
      })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: () => {
          this.authService.logout();

          this.router.navigate(['/login'], {
            queryParams: { passwordChanged: 'true' },
          });
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage =
              'Current password is incorrect or your session has expired.';
          } else if (error.status === 400) {
            this.errorMessage =
              'Password does not meet the server requirements. Check the values and try again.';
          } else if (error.status === 0) {
            this.errorMessage =
              'Unable to connect to the server. Please try again.';
          } else {
            this.errorMessage =
              'Password change failed. Please try again later.';
          }
        },
      });
  }
}