import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'HR' | 'EMPLOYEE';
  employeeId: number | null;
  mustChangePassword: boolean;
}

export type CurrentUser = Omit<LoginResponse, 'accessToken'>;

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly apiUrl = 'http://localhost:8080/api/auth';

  private readonly TOKEN_KEY = 'ems_access_token';
  private readonly USER_KEY = 'ems_current_user';

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (!this.isBrowser) {
            return;
          }

          sessionStorage.setItem(this.TOKEN_KEY, response.accessToken);

          const { accessToken, ...user } = response;

          sessionStorage.setItem(
            this.USER_KEY,
            JSON.stringify(user)
          );
        })
      );
  }

  changePassword(
    request: ChangePasswordRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/change-password`,
      request
    );
  }

  logout(): void {
    if (!this.isBrowser) {
      return;
    }

    sessionStorage.removeItem(this.TOKEN_KEY);
    sessionStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    return this.isBrowser
      ? sessionStorage.getItem(this.TOKEN_KEY)
      : null;
  }

  getCurrentUser(): CurrentUser | null {
    if (!this.isBrowser) {
      return null;
    }

    const user = sessionStorage.getItem(this.USER_KEY);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as CurrentUser;
    } catch {
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  mustChangePassword(): boolean {
    return this.getCurrentUser()?.mustChangePassword === true;
  }

  getUserRole(): string | null {
    return this.getCurrentUser()?.role ?? null;
  }

  hasRole(roles: string[]): boolean {
    const currentRole = this.getUserRole();

    return currentRole !== null && roles.includes(currentRole);
  }
}