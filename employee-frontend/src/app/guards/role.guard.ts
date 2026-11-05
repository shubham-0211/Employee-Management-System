import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Allow server-side rendering.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = route.data['roles'] as string[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (authService.hasRole(allowedRoles)) {
    return true;
  }

  // Employees should never be redirected to the HR dashboard.
  if (authService.getUserRole() === 'EMPLOYEE') {
    return router.createUrlTree(['/employees']);
  }

  // Redirect other authenticated users to the main dashboard.
  return router.createUrlTree(['/']);
};