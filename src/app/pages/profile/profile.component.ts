import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { UserDto, ProfileUpdateFormDto, UserMapper } from '../../core/dto/user.dto';
import { TranslateModule } from '@ngx-translate/core';
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdLabelComponent } from '../../toolbox/ad-label/ad-label.component';
import { AdCardComponent } from '../../toolbox/ad-card/ad-card.component';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdAutocompleteComponent } from '../../toolbox/ad-autocomplete/ad-autocomplete.component';
import { ResetPasswordComponent } from '../../shared/components/reset-password/reset-password.component';
import { NotificationService } from 'src/app/core/services/notification.service';
import { LookupService } from '../../core/services/lookup.service';
import { Job } from 'src/app/core/dto/job.dto';
import { Nationality } from 'src/app/core/dto/nationality.dto';
import { City } from 'src/app/core/dto/city.dto';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TranslateModule,
        AdInputComponent,
        AdButtonComponent,
        AdLabelComponent,
        AdCardComponent,
        AdDialogComponent,
        AdAutocompleteComponent,
        ResetPasswordComponent
    ],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    profileForm!: FormGroup<ProfileUpdateFormDto>;
    currentUser: UserDto | null = null;
    isEditMode = false;
    profileImageUrl = 'assets/images/placeholder-avatar.png';
    selectedFile: File | null = null;
    uploadError = '';

    showResetPasswordDialog = false;

    private destroy$ = new Subject<void>();
    hasUserValidEmail: boolean = false;

    jobs: Job[] = [];
    nationalities: Nationality[] = [];
    cities: City[] = [];

    constructor(
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private userService: UserService,
        private lookupService: LookupService
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadUserData();
        this.loadLookups();
    }

    private loadLookups() {
        this.lookupService.getJobs()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => this.jobs = data,
                error: (error) => this.notificationService.showError(error)
            });

        this.lookupService.getNationalities()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => this.nationalities = data,
                error: (error) => this.notificationService.showError(error)
            });

        this.lookupService.getCities()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => this.cities = data,
                error: (error) => this.notificationService.showError(error)
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initForm(): void {
        this.profileForm = this.fb.group<ProfileUpdateFormDto>({
            firstName: this.fb.control({ value: '', disabled: true }, Validators.required),
            lastName: this.fb.control({ value: '', disabled: true }, Validators.required),
            email: this.fb.control({ value: '', disabled: true }, [Validators.required, Validators.email]),
            password: this.fb.control({ value: '', disabled: true }),
            jobType: this.fb.control({ value: '', disabled: true }),
            nationality: this.fb.control({ value: '', disabled: true }),
            city: this.fb.control({ value: '', disabled: true }),
            uploadedDocumentsCount: this.fb.control({ value: 0, disabled: true })
        });
    }

    private loadUserData(): void {
        this.currentUser = localStorage.getItem('current_user') ? JSON.parse(localStorage.getItem('current_user') || '{}') : null;
        if (this.currentUser != null && this.currentUser.id != null) {
            this.userService.getProfile(this.currentUser.id)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (user) => {
                        if (user) {
                            console.log(user);
                            this.currentUser = user;
                            this.updateFormWithUserData(user);
                            this.hasUserValidEmail = user.emailVerified;
                        }
                    },
                    error: (error) => this.notificationService.showError(error?.error?.message || 'Errore durante il caricamento del profilo')
                });
        } else {
            this.notificationService.showError('Errore durante il recupero del profilo');
            return;
        }

    }

    private updateFormWithUserData(user: UserDto): void {
        console.log(user);

        this.profileForm.patchValue({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            password: this.obfuscatePassword(user.password),
            jobType: user.jobType || '',
            nationality: user.nationality || '',
            city: user.city || '',
            uploadedDocumentsCount: user.uploadedDocumentsCount || 0
        });

        if (user.profileImageUrl) {
            this.profileImageUrl = user.profileImageUrl;
        }
    }

    private obfuscatePassword(password?: string): string {
        if (!password) return '';
        return '•'.repeat(password.length);
    }

    toggleEditMode(): void {
        this.isEditMode = !this.isEditMode;

        if (this.isEditMode) {
            this.enableForm();
        } else {
            this.disableForm();
            if (this.currentUser) {
                this.updateFormWithUserData(this.currentUser);
            }
        }
    }

    private enableForm(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            if (key !== 'uploadedDocumentsCount' && key !== 'email' && key !== 'password') {
                this.profileForm.get(key)?.enable();
            }
        });
    }

    private disableForm(): void {
        Object.keys(this.profileForm.controls).forEach(key => {
            this.profileForm.get(key)?.disable();
        });
    }

    saveProfile(): void {
        const currentUserId = this.currentUser?.id;
        if (this.profileForm.valid && currentUserId) {
            const updates = UserMapper.toProfileUpdateDto(this.profileForm.controls, currentUserId);

            this.userService.updateProfile(updates)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (updatedUser) => {
                        this.currentUser = updatedUser;
                        this.isEditMode = false;
                        this.disableForm();
                        this.notificationService.showSuccess('Profile updated successfully');
                    },
                    error: (error) => this.notificationService.showError(error?.error?.message || 'Errore durante l\'aggiornamento del profilo')
                });
        }
    }

    cancelEdit(): void {
        this.isEditMode = false;
        this.disableForm();
        if (this.currentUser) {
            this.updateFormWithUserData(this.currentUser);
        }
    }

    triggerFileInput(): void {
        const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

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

    private uploadProfileImage(): void {
        if (!this.selectedFile) return;
        if (!this.currentUser?.id) return;

        this.userService.uploadProfileImage(this.selectedFile, this.currentUser.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedUser) => {
                    this.currentUser = updatedUser;
                    if (updatedUser.profileImageUrl) {
                        this.profileImageUrl = updatedUser.profileImageUrl; // URL MinIO
                    }
                    this.selectedFile = null;
                    this.notificationService.showSuccess('Immagine del profilo caricata con successo');
                },
                error: (error) => this.notificationService.showError(error?.error?.message || 'Errore nel caricamento dell\'immagine')
            });
    }

    openResetPassword(): void {
        this.showResetPasswordDialog = true;
    }

}

