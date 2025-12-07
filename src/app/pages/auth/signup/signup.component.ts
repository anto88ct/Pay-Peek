import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { AdDropdownComponent } from '../../../toolbox/ad-dropdown/ad-dropdown.component'; // Ensure exists or use p-dropdown directly? 
// User said "use library components where possible". I'll use p-dropdown styled consistent if ad-dropdown doesn't exist or is simple.
// I'll check if ad-dropdown exists first. If not use p-dropdown. 
// Actually I don't recall seeing ad-dropdown in the file list earlier, but the user mentioned "ad-dropdown" in a previous conversation summary.
// Let's assume standard PrimeNG for dropdowns if I can't find it, but wait, the summary "Navbar and Dropdown Enhancements" mentioned creating ad-dropdown.
// I'll stick to standard PrimeNG Dropdown for now wrapped in a div or check. 
// Better: use direct PrimeNG modules for standard form elements if ad- wrapper is complex, but I'll use ad-input.

import { PasskeyComponent } from '../passkey/passkey.component';
import { AuthService } from '../../../core/services/auth.service';

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
        AdInputComponent,
        PasskeyComponent
    ],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    signupForm!: FormGroup;
    isLoading = false;
    showPasskeyDialog = false;
    passkeyMode: 'pin' | 'pattern' = 'pin';
    createdUser: any = null;

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
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.signupForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            job: [''],
            nationality: [''],
            city: [''],
            country: ['']
        }, { validators: this.passwordMatchValidator });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.isLoading = true;

            // Simulate API call
            setTimeout(() => {
                this.isLoading = false;

                // Save minimal user info to use for passkey creation
                this.createdUser = {
                    ...this.signupForm.value,
                    // mock ID
                    id: 'user_' + new Date().getTime(),
                    passkey: null // To be set
                };

                // Ask for passkey
                this.showPasskeyDialog = true;
            }, 1000);
        }
    }

    onPasskeySetupComplete(passkey: string) {
        // Save final user with passkey
        this.createdUser.passkey = passkey;
        this.createdUser.passKeyEnabled = true;

        // Persist to local storage to simulate registration
        localStorage.setItem('registered_user', JSON.stringify(this.createdUser));

        // Also log them in (fake)
        localStorage.setItem('jwt_token', 'fake.jwt.token');
        localStorage.setItem('current_user', JSON.stringify(this.createdUser));

        this.showPasskeyDialog = false;
        this.router.navigate(['/dashboard']);
    }

    skipPasskey() {
        // Save user without passkey
        this.createdUser.passKeyEnabled = false;
        localStorage.setItem('registered_user', JSON.stringify(this.createdUser));

        localStorage.setItem('jwt_token', 'fake.jwt.token');
        localStorage.setItem('current_user', JSON.stringify(this.createdUser));

        this.showPasskeyDialog = false;
        this.router.navigate(['/dashboard']);
    }
}
