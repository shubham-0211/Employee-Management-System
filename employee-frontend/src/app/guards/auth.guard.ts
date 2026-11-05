import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Allow server-side rendering; browser navigation performs the auth check.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const isPasswordChangeRoute =
    route.routeConfig?.path === 'change-password';

  if (
    authService.mustChangePassword()
    && !isPasswordChangeRoute
  ) {
    return router.createUrlTree(['/change-password']);
  }

  if (
    !authService.mustChangePassword()
    && isPasswordChangeRoute
  ) {
    return router.createUrlTree(['/']);
  }

  return true;
};