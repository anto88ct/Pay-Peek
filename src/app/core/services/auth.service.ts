import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { from as rxFrom } from 'rxjs';
import { BaseService } from './base.service';
import { UserDto } from "../dto/user.dto";
import { LoginDto } from "../dto/login.dto";
import { SignupDto } from "../dto/signup.dto";
import { HttpClient } from "@angular/common/http";
import {
  BiometricRegisterRequest,
  BiometricLoginRequest,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  BiometricResponse,
  PublicKeyCredentialJson
} from "../dto/biometric.dto";
import {
  AuthenticatorAttestationResponse,
  AuthenticatorAssertionResponse,
  AuthenticatorTransport
} from '@simplewebauthn/typescript-types';
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

  constructor(http: HttpClient) {
    super(http);
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
    return this.post<LoginResponse>('/auth/login', credentials).pipe(
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

  register(data: SignupDto): Observable<LoginResponse> {
    return this.post<LoginResponse>('/auth/register', data).pipe(
      tap((response: LoginResponse) => {
        this.saveAuthData(response);
        this.authenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Register error:', error);
        return throwError(() => error);
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

  //=========================================================================================================================================================================
  //                                                                         BIOMETRIC
  //=========================================================================================================================================================================



  /**
 * ✅ Observable - Check disponibilità biometria
 */
  isBiometricAvailable$(): Observable<boolean> {
    return of(null).pipe(
      switchMap(() => {
        try {
          if (!window.PublicKeyCredential || !('credentials' in navigator)) {
            return of(false);
          }
          if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            return rxFrom(PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
          }
          return of(true);
        } catch (error) {
          console.warn('Biometria check fallito:', error);
          return of(false);
        }
      }),
      catchError(error => {
        console.warn('Biometria availability check error:', error);
        return of(false);
      })
    );
  }

  isBiometricEnabled(): boolean {
    const user = this.getCurrentUser();
    return user?.preferences?.biometric ?? false;
  }

  registerBiometric$(email: string): Observable<BiometricResponse> {
    return this.isBiometricAvailable$().pipe(
      switchMap(available => {
        if (!available) {
          return throwError(() => new Error('Biometria non supportata dal dispositivo'));
        }
        return this.get<PublicKeyCredentialCreationOptionsJSON>(
          `/auth/biometric/register-challenge/${email}`
        );
      }),
      switchMap(options => {
        if (!options) {
          return throwError(() => new Error('Challenge non ricevuto dal server'));
        }
        const publicKey = this.preprocessCredentialCreation(options);
        return rxFrom(navigator.credentials.create({ publicKey })).pipe(
          switchMap((credential: any) => {
            if (!credential) {
              return throwError(() => new Error('Credential creation fallita'));
            }
            const request: BiometricRegisterRequest = {
              email,
              credential: this.credentialToJSON(credential)
            };
            return this.post<BiometricResponse>('/auth/biometric/register', request);
          })
        );
      }),
      tap(response => {
        this.saveAuthData(response);
        this.saveBiometricPreference(true);
      }),
      catchError(error => {
        console.error('Registrazione biometria fallita:', error);
        return throwError(() => error);
      })
    );
  }

  loginBiometric$(email: string): Observable<BiometricResponse> {
    return this.isBiometricAvailable$().pipe(
      switchMap(available => {
        if (!available) {
          return throwError(() => ({
            code: 'NOT_AVAILABLE',
            message: 'Biometria non disponibile su questo dispositivo'
          }));
        }
        return this.get<PublicKeyCredentialRequestOptionsJSON>(
          `/auth/biometric/login-challenge/${email}`
        ).pipe(
          catchError(err => throwError(() => ({
            code: 'CHALLENGE_FAILED',
            message: 'Server non ha generato la challenge'
          })))
        );
      }),
      switchMap(options => {
        if (!options) {
          return throwError(() => ({
            code: 'INVALID_OPTIONS',
            message: 'Opzioni credential non valide'
          }));
        }
        const publicKey = this.preprocessCredentialRequest(options);
        return rxFrom(navigator.credentials.get({ publicKey })).pipe(
          switchMap((assertion: any) => {
            if (!assertion) {
              return throwError(() => ({
                code: 'USER_CANCELLED',
                message: 'Autenticazione biometrica annullata'
              }));
            }
            const request: BiometricLoginRequest = {
              email,
              assertion: this.credentialToJSON(assertion)
            };
            return this.post<BiometricResponse>('/auth/biometric/login', request).pipe(
              catchError(err => throwError(() => ({
                code: 'SERVER_ERROR',
                message: err.error?.message || 'Errore server durante autenticazione'
              })))
            );
          })
        );
      }),
      tap(response => {
        this.saveAuthData(response);
        this.authenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login biometrico fallito:', error);
        return throwError(() => error);
      })
    );
  }

  setBiometricEnabled$(enabled: boolean): Observable<void> {
    const user = this.getCurrentUser();
    if (!user) {
      return throwError(() => new Error('Utente non trovato'));
    }
    return this.put<void>(
      '/settings/preferences',
      { ...user.preferences, biometric: enabled }
    ).pipe(
      tap(() => {
        this.saveBiometricPreference(enabled);
      }),
      catchError(error => {
        console.error('Error setting biometric preference:', error);
        return throwError(() => error);
      })
    );
  }

  private saveBiometricPreference(enabled: boolean): void {
    const user = this.getCurrentUser();
    if (user) {
      user.preferences = { ...user.preferences, biometric: enabled };
      localStorage.setItem('current_user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }


  // ============= HELPER METHODS

  private preprocessCredentialCreation(options: any): any {
    return {
      challenge: this.base64urlToBuffer(options.challenge),
      rp: options.rp,
      user: {
        id: this.base64urlToBuffer(options.user.id),
        name: options.user.name,
        displayName: options.user.displayName,
      },
      // FORZA l'algoritmo a -7 (ES256) se il server lo manda come stringa o oggetto
      pubKeyCredParams: options.pubKeyCredParams?.map((p: any) => ({
        type: 'public-key',
        alg: p.alg === 'ES256' || !p.alg ? -7 : Number(p.alg)
      })) || [{ type: 'public-key', alg: -7 }],

      authenticatorSelection: options.authenticatorSelection ? {
        authenticatorAttachment: options.authenticatorSelection.authenticatorAttachment,
        userVerification: options.authenticatorSelection.userVerification,
        // CORREZIONE: residentKey deve essere una stringa ('required', 'preferred', 'discouraged')
        residentKey: options.authenticatorSelection.requireResidentKey ? 'required' : 'preferred'
      } : undefined,

      attestation: options.attestation || 'none',
      timeout: 60000, // Forza 60 secondi
      excludeCredentials: options.excludeCredentials?.map((cred: any) => ({
        id: this.base64urlToBuffer(cred.id),
        type: 'public-key'
      })) || []
    };
  }

  private preprocessCredentialRequest(options: any): any {
    return {
      challenge: this.base64urlToBuffer(options.challenge),
      timeout: 60000,
      rpId: window.location.hostname,
      userVerification: options.userVerification || 'preferred',
      allowCredentials: options.allowCredentials?.map((cred: any) => ({
        id: this.base64urlToBuffer(cred.id),
        type: 'public-key'
      })) || []
    };
  }

  private base64urlToBuffer(data: any): ArrayBuffer {
    if (!data) return new Uint8Array(0).buffer;

    // Se ricevi l'oggetto { value: "..." }, estrai la stringa
    let base64url = typeof data === 'object' && data.value ? data.value : data;

    if (typeof base64url !== 'string') {
      console.error("Dato non convertibile in stringa:", data);
      return new Uint8Array(0).buffer;
    }

    // Pulizia e conversione
    let str = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4 !== 0) str += '=';

    const raw = window.atob(str);
    const result = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      result[i] = raw.charCodeAt(i);
    }
    return result.buffer;
  }

  private bufferToBase64url(buf: ArrayBuffer): string {
    const data = new Uint8Array(buf);
    const binStr = Array.from(data).map(b => String.fromCharCode(b)).join('');
    const base64 = btoa(binStr);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }


  /**
   * Converte PublicKeyCredential → JSON serializzabile
   */
  private credentialToJSON(credential: any): any {
    const response = credential.response;
    const result: any = {
      id: credential.id,
      rawId: this.bufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: this.bufferToBase64url(response.clientDataJSON),
      }
    };

    // Caso REGISTRAZIONE
    if (response.attestationObject) {
      result.response.attestationObject = this.bufferToBase64url(response.attestationObject);
    }

    // Caso LOGIN (Assertion)
    if (response.authenticatorData) {
      result.response.authenticatorData = this.bufferToBase64url(response.authenticatorData);
      result.response.signature = this.bufferToBase64url(response.signature);
      if (response.userHandle) {
        result.response.userHandle = this.bufferToBase64url(response.userHandle);
      }
    }

    return result;
  }

  private mapTransports(transports: string[]): AuthenticatorTransport[] {
    const transportMap: { [key: string]: AuthenticatorTransport } = {
      'usb': 'usb',
      'nfc': 'nfc',
      'ble': 'ble',
      'internal': 'internal',
      'hybrid': 'hybrid',
    };

    return transports
      .map(t => transportMap[t.toLowerCase()])
      .filter((t): t is AuthenticatorTransport => t !== undefined);
  }
}
