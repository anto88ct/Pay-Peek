import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from "../../../core/services/auth.service";
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { MessageModule } from "primeng/message";
import { CheckboxModule } from "primeng/checkbox";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { CommonModule, NgClass } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToolboxModule } from "../../../toolbox/toolbox.module";
import { ClientError } from "../../../core/models/error-response.dto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,           // ← PER *ngIf, ngClass, ecc.
    ReactiveFormsModule,
    TranslateModule,        // ← CORRETTO
    MessageModule,
    ToolboxModule,
    RouterModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
    this.themeService.initTheme();
    this.languageService.initLanguage();
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = ''; // Clear previous errors
      this.authService.loginFake(this.loginForm.value).subscribe({
        next: (response) => {
          this.authService.setToken(response.token, response.refreshToken || '');
          this.themeService.setTheme(response.user.preferences.theme);
          this.languageService.setLanguage(response.user.preferences.language);
          this.router.navigate(['/dashboard']);
        },
        error: (clientError: ClientError) => {
          // The error is already transformed by the interceptor
          this.errorMessage = clientError.message || 'Si è verificato un errore durante il login';
          this.isLoading = false;
        }
      });
    }
  }

  openBiometricLogin(): void {
    // Logica per aprire dialog o navigare a componente biometrico
    // Esempio: naviga alla pagina login biometrico
    this.router.navigate(['/auth/login-biometric']);
  }

}
