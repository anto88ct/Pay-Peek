import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt_token');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.logout();
          return throwError(() => new Error('Token scaduto'));
        }
        return throwError(() => error);
      })
    );
  }

  private logout(): void {
    localStorage.removeItem('jwt_token');
    // Naviga a login page
    // window.location.href = '/login';
  }
}
