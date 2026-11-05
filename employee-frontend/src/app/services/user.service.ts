import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  User,
  UserCreateRequest,
  UserPasswordResetRequest,
  UserStatusUpdateRequest,
} from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/users';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(request: UserCreateRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, request);
  }

  resetPassword(
    id: number,
    request: UserPasswordResetRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}/password`,
      request
    );
  }

  updateUserStatus(
    id: number,
    request: UserStatusUpdateRequest
  ): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/${id}/status`,
      request
    );
  }
}