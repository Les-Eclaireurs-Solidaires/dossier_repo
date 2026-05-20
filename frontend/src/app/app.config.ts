import {
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url-interceptor';
import { isPlatformBrowser } from '@angular/common';
import { AuthStateService } from './services/authentication/auth-state.service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { httpErrorInterceptor } from './interceptors/http-error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(
      withEventReplay(),
      withHttpTransferCacheOptions({
        includeRequestsWithAuthHeaders: true,
        includePostRequests: false,
        filter: (req) => !req.url.endsWith('/auth/me'),
      }),
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, httpErrorInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      }),
    ),
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);
      if (!isPlatformBrowser(platformId)) return;
      const authStateService = inject(AuthStateService);
      return firstValueFrom(authStateService.getUser().pipe(
        catchError(() => of(null))
      ));
    }),
  ],
};
