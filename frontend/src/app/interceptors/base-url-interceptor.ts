import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../environment/environment';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const isServer = isPlatformServer(platformId);

  if (req.url.startsWith('/api') || req.url.startsWith('/auth')) {
    const baseUrl = isServer ? environment.apiUrlServer : environment.apiUrlClient;
    let headers = req.headers;

    const apiReq = req.clone({
      url: `${baseUrl}${req.url}`,
      headers,
    });

    return next(apiReq);
  }

  return next(req);
};
