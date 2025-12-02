// src/app/shared/services/auth.service.ts (aggiunta)
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {HttpClient} from "@angular/common/http";

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
