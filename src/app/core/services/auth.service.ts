// src/app/shared/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { BaseService } from './base.service';
import {UserDto} from "../models/user.dto";
import {LoginDto} from "../models/login.dto";

export interface LoginResponse {
  success: boolean;
  token: string;
  user: UserDto;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  private authenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);

  constructor() {
    super();
    this.initAuthState();
  }

  // Inizializza stato auth da localStorage
  private initAuthState(): void {
    const token = localStorage.getItem('jwt_token');
    const userStr = localStorage.getItem('current_user');

    if (token) {
      this.authenticatedSubject.next(true);
      if (userStr) {
        try {
          const user = JSON.parse(userStr) as UserDto;
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error('Errore parsing user:', e);
        }
      }
    }
  }


  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((response: LoginResponse) => {
        this.saveAuthData(response);
        this.authenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => new Error('Credenziali non valide'));
      })
    );
  }

  /** Salva token, user e role in localStorage */
  private saveAuthData(response: LoginResponse): void {
    localStorage.setItem('jwt_token', response.token);
    localStorage.setItem('user_role', response.role || 'user');
    localStorage.setItem('current_user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  /** Stato autenticazione per Guards */
  isAuthenticated(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  /** Current user observable */
  getCurrentUser$(): Observable<UserDto | null> {
    return this.currentUserSubject.asObservable();
  }

  /** Current user sync */
  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }

  /** Verifica se utente ha role specifico */
  hasRole(role: string): boolean {
    const userRole = localStorage.getItem('user_role');
    return userRole === role;
  }

  /** Logout completo */
  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('current_user');
    localStorage.removeItem('user_role');
    localStorage.removeItem('refresh_token');

    this.authenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /** Refresh token (se backend lo supporta) */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Refresh token mancante'));
    }

    return this.post<LoginResponse>('/api/auth/refresh', { refreshToken }).pipe(
      tap(response => this.saveAuthData(response))
    );
  }
}
