// src/app/shared/services/auth.service.ts (aggiunta)
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { UserDto } from '../models/user.dto';

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
    return forkJoin({
      credentials: this.http.get<any>('assets/data/fake-credentials.json'),
      users: this.http.get<any>('assets/data/user-fake.json')
    }).pipe(
      switchMap(({ credentials: credData, users: userData }) => {
        const validCredential = credData.credentials?.find((u: any) =>
          u.email === credentials.email && u.password === credentials.password
        );

        if (validCredential && userData.users && userData.users.length > 0) {
          // Randomly select a user from user-fake.json
          const randomIndex = Math.floor(Math.random() * userData.users.length);
          const randomUser = userData.users[randomIndex];

          const token = `fake-jwt.${validCredential.role}.${Date.now()}`;
          localStorage.setItem('jwt_token', token);
          localStorage.setItem('user_role', validCredential.role);

          // Store complete user data
          const userDto: UserDto = {
            ...randomUser,
            email: credentials.email, // Override with login email
            passkey: validCredential.passkey || randomUser.passkey // Use credential passkey if available
          };

          localStorage.setItem('current_user', JSON.stringify(userDto));

          this.authenticatedSubject.next(true);

          return of({
            success: true,
            token,
            user: userDto
          });
        }
        return throwError(() => new Error('Credenziali non valide'));
      }),
      catchError((error) => {
        console.error('Login error:', error);
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


  getCurrentUser(): UserDto | null {
    const userStr = localStorage.getItem('current_user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as UserDto;
      } catch (e) {
        console.error('Error parsing user data:', e);
        return null;
      }
    }
    return null;
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('user_role');
    this.authenticatedSubject.next(false);
    // eventuale navigazione alla pagina login gestita esternamente al service
  }
}
