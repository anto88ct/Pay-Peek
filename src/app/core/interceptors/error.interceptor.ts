import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorResponseDto, ClientError } from '../dto/error-response.dto';

/**
 * HTTP Error Interceptor
 * Intercepts all HTTP errors and transforms them into a standardized format
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                const clientError: ClientError = this.handleError(error);
                console.error('HTTP Error:', clientError);
                return throwError(() => clientError);
            })
        );
    }

    /**
     * Handles different types of HTTP errors and transforms them into ClientError
     */
    private handleError(error: HttpErrorResponse): ClientError {
        // Server-side error (4xx, 5xx)
        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            return {
                type: 'network',
                message: `Errore di rete: ${error.error.message}`,
                originalError: error
            };
        } else {
            // Backend returned an unsuccessful response code
            const errorDto: ErrorResponseDto = error.error;

            if (error.status === 0) {
                // Network error or CORS issue
                return {
                    type: 'network',
                    statusCode: 0,
                    message: 'Impossibile connettersi al server. Verifica la connessione internet.',
                    originalError: error
                };
            }

            if (error.status >= 400 && error.status < 500) {
                // Client errors (400-499)
                return {
                    type: 'client',
                    statusCode: error.status,
                    message: errorDto?.message || this.getDefaultClientErrorMessage(error.status),
                    originalError: error
                };
            }

            if (error.status >= 500) {
                // Server errors (500-599)
                return {
                    type: 'server',
                    statusCode: error.status,
                    message: errorDto?.message || 'Errore del server. Riprova più tardi.',
                    originalError: error
                };
            }

            // Unknown error
            return {
                type: 'server',
                statusCode: error.status,
                message: errorDto?.message || 'Si è verificato un errore imprevisto.',
                originalError: error
            };
        }
    }

    /**
     * Returns default error messages based on HTTP status code
     */
    private getDefaultClientErrorMessage(statusCode: number): string {
        switch (statusCode) {
            case 400:
                return 'Richiesta non valida.';
            case 401:
                return 'Accesso non autorizzato. Effettua il login.';
            case 403:
                return 'Non hai i permessi per accedere a questa risorsa.';
            case 404:
                return 'Risorsa non trovata.';
            case 409:
                return 'Conflitto con lo stato corrente della risorsa.';
            case 422:
                return 'Dati non validi.';
            case 429:
                return 'Troppe richieste. Riprova più tardi.';
            default:
                return 'Errore nella richiesta.';
        }
    }
}
