import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';

// Custom
import { AdCardComponent } from '../../../toolbox/ad-card/ad-card.component';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { AdInputComponent } from '../../../toolbox/ad-input/ad-input.component';

import { AuthService } from '../../../core/services/auth.service';
import { SignupFormDto, SignupMapper } from '../../../core/dto/signup.dto';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { LoginResponse } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Subject, takeUntil, timeout } from 'rxjs';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        TranslateModule,
        InputTextModule,
        PasswordModule,
        DropdownModule,
        DialogModule,
        MessageModule,
        AdCardComponent,
        AdButtonComponent,
        AdInputComponent
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
    signupForm!: FormGroup<SignupFormDto>;
    isLoading = false;
    showBiometricPrompt = false;
    isBiometricLoading = false;

    private destroy$ = new Subject<void>();

    // Mock Data
    jobs = [
        { label: 'Sviluppatore', value: 'developer' },
        { label: 'Designer', value: 'designer' },
        { label: 'Project Manager', value: 'pm' },
        { label: 'Studente', value: 'student' },
        { label: 'Altro', value: 'other' }
    ];

    nationalities = [
        { label: 'Italiana', value: 'IT' },
        { label: 'Francese', value: 'FR' },
        { label: 'Tedesca', value: 'DE' },
        { label: 'Inglese', value: 'UK' },
        { label: 'Spagnola', value: 'ES' }
    ];

    cities = [
        { label: 'Roma', value: 'roma' },
        { label: 'Milano', value: 'milano' },
        { label: 'Napoli', value: 'napoli' },
        { label: 'Torino', value: 'torino' },
        { label: 'Firenze', value: 'firenze' }
    ];

    countries = [
        { label: 'Italia', value: 'IT' },
        { label: 'Francia', value: 'FR' },
        { label: 'Germania', value: 'DE' },
        { label: 'Regno Unito', value: 'UK' },
        { label: 'Spagna', value: 'ES' }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private themeService: ThemeService,
        private languageService: LanguageService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.signupForm = this.fb.group<SignupFormDto>({
            firstName: this.fb.control('', Validators.required),
            lastName: this.fb.control('', Validators.required),
            email: this.fb.control('', [Validators.required, Validators.email]),
            password: this.fb.control('', [Validators.required, Validators.minLength(8)]),
            confirmPassword: this.fb.control('', Validators.required),
            job: this.fb.control(''),
            nationality: this.fb.control(''),
            city: this.fb.control(''),
            country: this.fb.control('')
        }, { validators: this.passwordMatchValidator });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    passwordMatchValidator(g: AbstractControl) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.isLoading = true;

            const signupDto = SignupMapper.toDTO(this.signupForm.controls);

            this.authService.register(signupDto)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (response: LoginResponse) => {
                        this.themeService.setTheme(response.user.preferences?.theme || 'light');
                        this.languageService.setLanguage(response.user.preferences?.language || 'it');

                        localStorage.setItem('registered_user', JSON.stringify({
                            email: response.user.email,
                            firstName: response.user.firstName,
                            profileImageUrl: response.user.profileImageUrl,
                        }));

                        this.authService.isBiometricAvailable$()
                            .pipe(takeUntil(this.destroy$))
                            .subscribe({
                                next: (bioAvailable) => {
                                    if (bioAvailable) {
                                        this.showBiometricPrompt = true;
                                    } else {
                                        this.router.navigate(['/dashboard']);
                                    }
                                    this.isLoading = false;
                                },
                                error: (error) => {
                                    console.error('Biometric availability check failed:', error);
                                    this.router.navigate(['/dashboard']);
                                    this.isLoading = false;
                                }
                            });
                    },
                    error: (error) => {
                        this.isLoading = false;
                        this.notificationService.showError(error?.error?.message || 'Registrazione fallita');
                    }
                });
        }
    }

    enableBiometric() {
        this.isBiometricLoading = true;
        const email = this.signupForm.get('email')?.value;

        if (!email) {
            this.notificationService.showError('Email non valida');
            this.router.navigate(['/dashboard']);
            return;
        }

        this.authService.registerBiometric$(email)
            .pipe(
                timeout(30000), // 30 secondi timeout
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: () => {
                    this.notificationService.showSuccess('Biometria abilitata con successo');
                    this.router.navigate(['/dashboard']);
                },
                error: (error: any) => {
                    console.error('Biometric registration failed:', error);

                    if (error.name === 'TimeoutError') {
                        this.notificationService.showError('Operazione biometrica scaduta (30s)');
                    } else {
                        this.notificationService.showError(error?.message || 'Errore abilitazione biometria');
                    }

                    // Navigate anyway per non bloccare l'utente
                    this.router.navigate(['/dashboard']);
                },
                complete: () => {
                    this.isBiometricLoading = false;
                    this.showBiometricPrompt = false;
                }
            });
    }

    skipBiometric() {
        this.showBiometricPrompt = false;
        this.router.navigate(['/dashboard']);
    }
}