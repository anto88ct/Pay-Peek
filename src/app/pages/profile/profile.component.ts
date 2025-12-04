import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { UserDto } from '../../core/models/user.dto';
import { TranslateModule } from '@ngx-translate/core';
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdLabelComponent } from '../../toolbox/ad-label/ad-label.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        AdInputComponent,
        AdButtonComponent,
        AdLabelComponent
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    profileForm!: FormGroup;
    currentUser: UserDto | null = null;
    isEditMode = false;
    profileImageUrl = 'assets/images/placeholder-avatar.png';
    selectedFile: File | null = null;
    uploadError = '';
    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        console.log('ProfileComponent ngOnInit - prima initForm');
        this.initForm();
        console.log('ProfileComponent - prima loadUserData');
        this.loadUserData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        this.profileForm = this.fb.group({
            firstName: [{ value: '', disabled: true }, Validators.required],
            lastName: [{ value: '', disabled: true }, Validators.required],
            email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
            password: [{ value: '', disabled: true }],
            passkey: [{ value: '', disabled: true }],
            jobType: [{ value: '', disabled: true }],
            nationality: [{ value: '', disabled: true }],
            city: [{ value: '', disabled: true }],
            country: [{ value: '', disabled: true }],
            uploadedDocumentsCount: [{ value: 0, disabled: true }]
        });
    }

    private loadUserData(): void {
        console.log('loadUserData chiamato');
        this.userService.getProfile()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (user) => {
                    console.log('Dati ricevuti:', user);  // ← AGGIUNGI QUESTO
                    if (user) {
                        this.currentUser = user;
                        this.updateFormWithUserData(user);
                    }
                },
                error: (error) => {
                    console.error('Error loading user profile:', error);
                }
            });
    }

    private updateFormWithUserData(user: UserDto): void {
        this.profileForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            password: this.obfuscatePassword(user.password),
            passkey: this.obfuscatePasskey(user.passkey),
            jobType: user.jobType || '',
            nationality: user.nationality || '',
            city: user.city || '',
            country: user.country || '',
            uploadedDocumentsCount: user.uploadedDocumentsCount || 0
        });
    }

    /**
     * Obfuscate password with asterisks
     */
    private obfuscatePassword(password?: string): string {
        if (!password) return '';
        return '•'.repeat(password.length);
    }

    /**
     * Obfuscate passkey with asterisks
     */
    private obfuscatePasskey(passkey?: string): string {
        if (!passkey) return '';
        return '•'.repeat(passkey.length);
    }

    /**
     * Toggle edit mode
     */
    toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;

        if (this.isEditMode) {
            this.enableForm();
        } else {
            this.disableForm();
            // Reset form to original values
            if (this.currentUser) {
                this.updateFormWithUserData(this.currentUser);
            }
        }
    }

    /**
     * Enable form fields for editing
     */
    private enableForm(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            // Don't enable uploadedDocumentsCount as it's read-only
            if (key !== 'uploadedDocumentsCount') {
                this.profileForm.get(key)?.enable();
            }
        });
    }

    /**
     * Disable form fields
     */
    private disableForm(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            this.profileForm.get(key)?.disable();
        });
    }

    /**
     * Save profile changes
     */
    saveProfile(): void {
        if (this.profileForm.valid) {
            const formValue = this.profileForm.getRawValue();

            // Don't send obfuscated passwords - in real app, handle password changes separately
            const updates = {
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                email: formValue.email,
                jobType: formValue.jobType,
                nationality: formValue.nationality,
                city: formValue.city,
                country: formValue.country
            };

            this.userService.updateProfile(updates)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedUser) => {
                        this.currentUser = updatedUser;
                        this.isEditMode = false;
                        this.disableForm();
                        console.log('Profile updated successfully');
                    },
                    error: (error) => {
                        console.error('Error updating profile:', error);
                    }
                });
        }
    }

    /**
     * Cancel editing
     */
    cancelEdit(): void {
        this.isEditMode = false;
        this.disableForm();
        if (this.currentUser) {
            this.updateFormWithUserData(this.currentUser);
        }
    }

    /**
     * Trigger file input click
     */
    triggerFileInput(): void {
        const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    /**
     * Handle file selection
     */
    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.uploadError = '';

            // Validate file type
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                this.uploadError = 'Solo file PNG, JPG e JPEG sono consentiti';
                return;
            }

            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                this.uploadError = 'Il file supera il limite di 5MB';
                return;
            }

            this.selectedFile = file;
            this.uploadProfileImage();
        }
    }

    /**
     * Upload profile image
     */
    private uploadProfileImage(): void {
        if (!this.selectedFile) return;

        this.userService.uploadProfileImage(this.selectedFile)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedUser) => {
                    this.currentUser = updatedUser;
                    if (updatedUser.profileImageBase64) {
                        this.profileImageUrl = updatedUser.profileImageBase64;
                    }
                    this.selectedFile = null;
                    console.log('Profile image uploaded successfully');
                },
                error: (error) => {
                    this.uploadError = error.message || 'Errore nel caricamento dell\'immagine';
                    console.error('Error uploading image:', error);
                }
            });
    }
}

