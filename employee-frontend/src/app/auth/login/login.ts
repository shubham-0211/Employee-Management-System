import {
  Component,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly loginForm = this.formBuilder.nonNullable.group({
    username: ['', [Validators.required, Validators.maxLength(50)]],
    password: ['', [Validators.required]],
  });

  isLoading = false;
  errorMessage = '';

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.isLoading = false;
        this.cdr.detectChanges();

        if (this.authService.mustChangePassword()) {
          this.router.navigate(['/change-password']);
          return;
        }

        const role = this.authService.getUserRole();

        if (role === 'EMPLOYEE') {
          this.router.navigate(['/employees']);
        } else {
          this.router.navigate(['/']);
        }
      },

      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.errorMessage = 'Invalid username or password.';
        } else if (error.status === 429) {
          const retryAfter = error.headers.get('Retry-After');

          this.errorMessage = retryAfter
            ? `Too many login attempts. Try again in ${retryAfter} seconds.`
            : 'Too many login attempts. Please try again later.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Unable to connect to the server. Please try again.';
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }

        this.cdr.detectChanges();
      },
    });
  }
}