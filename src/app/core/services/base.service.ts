import {Injectable, Injector} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "src/enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export abstract class BaseService {

  protected readonly apiUrl = environment.apiUrl;
  protected http!: HttpClient;

  constructor() {
    const injector = Injector.create({ providers: [{ provide: HttpClient, useClass: HttpClient }] });
    this.http = injector.get(HttpClient);
  }

  protected get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`).pipe(
      catchError(this.handleError.bind(this))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Errore API [${error.status}]:`, error.message);
    // Qui puoi aggiungere toast notification o logging service
    return throwError(() => new Error(`Errore: ${error.message}`));
  }
}
