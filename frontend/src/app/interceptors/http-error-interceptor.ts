import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../services/authentication/auth-api.service';
import { AuthStateService } from '../services/authentication/auth-state.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authApiService = inject(AuthApiService);
  const authStateService = inject(AuthStateService);
  const notificationService = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint = req.url.includes('/auth/refresh') || req.url.includes('/auth/login');

      if (isAuthEndpoint) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        return authApiService.refresh().pipe(
          switchMap(() => next(req.clone())),
          catchError((refreshError: HttpErrorResponse) => {
            const PUBLIC_ROUTES = [
              '/login',
              '/register',
              '/forgot-password',
              '/reset-password',
              '/home',
            ];
            const currentUrl = router.url;
            const isPublicArrival = PUBLIC_ROUTES.some(
              (route) => currentUrl === '/' || currentUrl.startsWith(route),
            );
            authStateService.updateState(null);
            authStateService.updateUserProfile(null);

            if (!isPublicArrival) {
              notificationService.showError('Votre session a expiré. Veuillez vous reconnecter.');
            }

            router.navigate(['/login']);

            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
