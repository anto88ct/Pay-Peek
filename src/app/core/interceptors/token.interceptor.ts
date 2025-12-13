import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('jwt_token');

    let authReq = req;
    const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');

    if (token && !isAuthRequest) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(authReq).pipe(
        catchError(error => {
            if (error.status === 401) {
                // Opzionale: gestire logout o refresh qui
                // inject(AuthService).logout();
            }
            return throwError(() => error);
        })
    );
};
