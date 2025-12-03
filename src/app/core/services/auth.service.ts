// src/app/shared/services/auth.service.ts (aggiunta)
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Controlla se token JWT è presente e valido in localStorage per settare lo stato iniziale
    const token = localStorage.getItem('jwt_token');
    this.authenticatedSubject.next(!!token);
  }

  // Metodo isAuthenticated usato dal guard
  isAuthenticated(): Observable<boolean> {
    // Puoi anche far controlli più sofisticati su validità token o scadenza
    return this.authenticatedSubject.asObservable();
  }

  // Metodo login simile a prima che aggiorna authenticatedSubject
  login(credentials: { email: string; password: string }): Observable<any> {
    // Esempio: chiamata API e aggiorna stato
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('jwt_token', response.token);
        this.authenticatedSubject.next(true);
      })
    );
  }

  loginFake(credentials: { email: string; password: string }): Observable<any> {
    return this.http.get<any>('assets/data/fake-credentials.json').pipe(
      switchMap((data) => {
        console.log(data);

        const user = data.credentials?.find((u: any) =>
          u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          const token = `fake-jwt.${user.role}.${Date.now()}`;
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('user_role', user.role);
          this.authenticatedSubject.next(true); // ← Aggiunto per aggiornare lo stato di autenticazione

          return of({
            success: true,
            token,
            user: {
              email: user.email,
              role: user.role,
              name: user.name,
              preferences: { language: 'it', theme: 'light' }
            }
          });
        }
        return throwError(() => new Error('Credenziali non valide'));
      }),
      catchError((error) => {
        return throwError(() => new Error('Credenziali non valide'));
      })
    );
  }


  // src/app/shared/services/auth.service.ts (snippet)
  setToken(token: string, refreshToken: string): void {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    this.authenticatedSubject.next(true);
    // Puoi anche aggiornare un BehaviorSubject con il token corrente se utile
  }


  logout() {
    localStorage.removeItem('jwt_token');
    this.authenticatedSubject.next(false);
    // eventuale navigazione alla pagina login gestita esternamente al service
  }
}
