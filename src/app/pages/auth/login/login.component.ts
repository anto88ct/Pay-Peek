import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService, LoginResponse } from "../../../core/services/auth.service";
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { MessageModule } from "primeng/message";
import { CheckboxModule } from "primeng/checkbox";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CommonModule, NgClass } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { AdInputComponent } from '../../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { AdCheckboxComponent } from '../../../toolbox/ad-checkbox/ad-checkbox.component';
import { AdCardComponent } from '../../../toolbox/ad-card/ad-card.component';
import { ClientError } from "../../../core/dto/error-response.dto";
import { ResetPasswordComponent } from '../../../shared/components/reset-password/reset-password.component';
import { DialogModule } from 'primeng/dialog';
import { LoginFormDto, LoginMapper } from "../../../core/dto/login.dto";
import { Subject, takeUntil, timeout } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    MessageModule,
    AdInputComponent,
    AdButtonComponent,
    AdCheckboxComponent,
    AdCardComponent,
    RouterModule,
    ResetPasswordComponent,
    DialogModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup<LoginFormDto>;
  isLoading = false;
  errorMessage = '';
  showResetPasswordDialog = false;
  hasRegisteredUser = false;
  isBiometricLoading: boolean = false;
  isBiometricAvailable: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group<LoginFormDto>({
      email: this.fb.control<string>('', [Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(8)]),
      rememberMe: this.fb.control<boolean>(false)
    });
    this.themeService.initTheme();
    this.languageService.initLanguage();
    this.checkUserRegistration();

    // ✅ Observable - Check biometria disponibile
    this.authService.isBiometricAvailable$()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (available) => {
          this.isBiometricAvailable = available;
        },
        error: (error) => {
          console.error('Biometric availability check failed:', error);
          this.isBiometricAvailable = false;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkUserRegistration() {
    this.hasRegisteredUser = !!localStorage.getItem('registered_user');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginDto = LoginMapper.toDTO(this.loginForm.controls);

      this.authService.login(loginDto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response: LoginResponse) => {
            this.themeService.setTheme(response.user.preferences?.theme || 'light');
            this.languageService.setLanguage(response.user.preferences?.language || 'it');

            localStorage.setItem('registered_user', JSON.stringify({
              email: response.user.email,
              firstName: response.user.firstName,
              profileImageUrl: response.user.profileImageUrl,
              passkey: response.user.passkey || '1234'
            }));

            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Si è verificato un errore durante il login';
            this.isLoading = false;
          }
        });
    }
  }

  onBiometricLogin(): void {
    try {
      this.isBiometricLoading = true;
      this.errorMessage = '';

      const email = this.loginForm.get('email')?.value;
      if (!email || !this.isValidEmail(email)) {
        this.errorMessage = 'Inserisci un email valida per continuare';
        this.isBiometricLoading = false;
        return;
      }

      this.authService.loginBiometric$(email)
        .pipe(
          timeout(30000), // 30 secondi timeout
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response: any) => {
            this.themeService.setTheme(response.user.preferences?.theme || 'light');
            this.languageService.setLanguage(response.user.preferences?.language || 'it');

            localStorage.setItem('registered_user', JSON.stringify({
              email: response.user.email,
              firstName: response.user.firstName,
              profileImageUrl: response.user.profileImageUrl
            }));

            this.router.navigate(['/dashboard']);
          },
          error: (error: any) => {
            if (error.code === 'USER_CANCELLED') {
              this.errorMessage = 'Autenticazione biometrica annullata';
            } else if (error.code === 'CHALLENGE_FAILED') {
              this.errorMessage = 'Errore nella comunicazione con il server';
            } else if (error.code === 'NOT_AVAILABLE') {
              this.errorMessage = 'Biometria non disponibile su questo dispositivo';
            } else if (error.name === 'TimeoutError') {
              this.errorMessage = 'Operazione biometrica scaduta (30s), riprova';
            } else {
              this.errorMessage = error.message || 'Autenticazione biometrica fallita';
            }
            console.error('Biometric login error:', error);
          },
          complete: () => {
            this.isBiometricLoading = false;
          }
        });
    } catch (error: any) {
      this.errorMessage = error.message || 'Errore durante autenticazione biometrica';
      this.isBiometricLoading = false;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}