import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordResetFormDto, PasswordResetMapper } from '../../../core/dto/user.dto';
import { AdInputComponent } from '../../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from 'src/app/core/services/user.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdInputComponent,
        AdButtonComponent,
        TranslateModule
    ],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    form: FormGroup<PasswordResetFormDto>;
    loading = false;
    token: string | null = null;
    isRequestMode = true;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.form = this.fb.group<PasswordResetFormDto>({
            newPassword: this.fb.control(''),
            confirmPassword: this.fb.control(''),
            email: this.fb.control('', [Validators.required, Validators.email])
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'] || null;

            if (this.token) {
                console.log('Token trovato, entro in Reset Mode');
                this.isRequestMode = false;
                this.setupResetMode();
            } else {
                console.log('Nessun token, resto in Request Mode');
                this.isRequestMode = true;
                this.setupRequestMode();
            }
        });
    }

    private setupRequestMode() {
        this.form.get('email')?.setValidators([Validators.required, Validators.email]);
        this.form.get('newPassword')?.clearValidators();
        this.form.get('confirmPassword')?.clearValidators();
        this.form.get('newPassword')?.reset();
        this.form.get('confirmPassword')?.reset();
        this.form.updateValueAndValidity();
    }

    private setupResetMode() {
        this.form.get('email')?.clearValidators();
        this.form.get('newPassword')?.setValidators([Validators.required, Validators.minLength(8)]);
        this.form.get('confirmPassword')?.setValidators([Validators.required]);
        this.form.setValidators(this.passwordMatchValidator);
        this.form.updateValueAndValidity();
    }

    passwordMatchValidator(g: AbstractControl) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onCancel() {
        // Se abbiamo un token, siamo sicuramente nella pagina standalone
        if (this.token) {
            this.router.navigate(['/login']);
        } else {
            // Altrimenti siamo nel flusso di richiesta password (probabile modal)
            this.close.emit();
        }
    }

    onSave() {
        if (this.form.valid) {
            this.loading = true;

            if (this.isRequestMode) {
                const email = this.form.get('email')?.value;
                this.userService.requestPasswordReset(email!).subscribe({
                    next: () => {
                        this.loading = false;
                        this.notificationService.showSuccess('Email inviata!');
                        this.onCancel()
                    },
                    error: (err) => {
                        this.loading = false;
                        this.notificationService.showError(err);
                    }
                });
            } else {
                const dto = PasswordResetMapper.toPasswordResetDto(this.form.controls, this.token);
                this.userService.completePasswordReset(dto).subscribe({
                    next: () => {
                        this.loading = false;
                        this.notificationService.showSuccess('Password aggiornata!');
                        this.router.navigate(['/login']);
                    },
                    error: (err) => {
                        this.loading = false;
                        this.notificationService.showError(err);
                    }
                });
            }
        } else {
            this.form.markAllAsTouched();
        }
    }
}
