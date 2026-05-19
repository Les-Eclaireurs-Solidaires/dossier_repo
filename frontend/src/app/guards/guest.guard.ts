import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '../services/authentication/auth-state.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (!authStateService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};