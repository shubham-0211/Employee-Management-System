import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
} from '@angular/common/http';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Do not attach an existing token to the login request.
  if (req.url.endsWith('/api/auth/login')) {
    return next(req);
  }

  const token = authService.getToken();

  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authenticatedRequest);
};