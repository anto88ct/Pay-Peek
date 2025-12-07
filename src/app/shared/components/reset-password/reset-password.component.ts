import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdInputComponent } from '../../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { TranslateModule } from '@ngx-translate/core';

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
export class ResetPasswordComponent {
    @Output() close = new EventEmitter<void>();

    form: FormGroup;
    loading = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            newPassword: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('newPassword')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onCancel() {
        this.close.emit();
    }

    onSave() {
        if (this.form.valid) {
            this.loading = true;
            // Simulate API call
            setTimeout(() => {
                this.loading = false;
                console.log('Password updated', this.form.value);
                this.close.emit();
            }, 1500);
        }
    }
}
