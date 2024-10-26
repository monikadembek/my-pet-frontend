import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { Router } from '@angular/router';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from '../../../constants/constants';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getToken(ACCESS_TOKEN_STORAGE_KEY);

  function addTokenToHeaders(req: HttpRequest<unknown>, token: string) {
    return req.clone({
      headers: req.headers.append('Authorization', `Bearer ${token}`),
    });
  }

  function handleExpiredToken(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    // call refresh token endpoint to get new access token
    return inject(AuthApiService)
      .refresh()
      .pipe(
        switchMap(() => {
          const newAccessToken = authService.getToken(ACCESS_TOKEN_STORAGE_KEY);
          return next(addTokenToHeaders(req, newAccessToken as string));
        }),
        catchError(error => {
          // handle refresh token error (redirect to login page)
          console.error('Error handling expired access token', error);
          inject(Router).navigate(['login']);
          return throwError(() => new Error(error));
        })
      );
  }

  if (accessToken) {
    req = addTokenToHeaders(req, accessToken);
  }

  return next(req).pipe(
    catchError(error => {
      // check for error due to expired token
      if (error.status === 401 && accessToken) {
        const refreshToken = authService.getToken(REFRESH_TOKEN_STORAGE_KEY);
        if (refreshToken) {
          return handleExpiredToken(req, next);
        }
      }

      return throwError(() => new Error(error));
    })
  );
};
