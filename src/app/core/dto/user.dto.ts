import { FormControl } from '@angular/forms';

export interface Preferences {
    language: 'it' | 'en';
    theme: 'light' | 'dark' | 'system';
    biometric?: boolean;
    emailNotifications: boolean;
}

export interface User {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    jobType?: string;
    city?: string;
    country?: string;
    profileImageUrl?: string;
    preferences: Preferences;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    passKeyEnabled: boolean;
    biometricEnabled: boolean;
    lastLogin?: Date;
}

export interface UserDto extends User {
    password?: string;
    passkey?: string;
    uploadedDocumentsCount?: number;
    nationality?: string;
    profileImageBase64?: string;
}

export interface ProfileUpdateDto {
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    passkey?: string;
    jobType?: string;
    city?: string;
    country?: string;
    nationality?: string;
    profileImageBase64?: string;
    uploadedDocumentsCount?: number;
}

export type ProfileUpdateFormDto = {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    jobType: FormControl<string | null>;
    nationality: FormControl<string | null>;
    city: FormControl<string | null>;
    country: FormControl<string | null>;
    uploadedDocumentsCount: FormControl<number | null>;
};

export class UserMapper {
    static toProfileUpdateDto(form: ProfileUpdateFormDto, id: string): ProfileUpdateDto {
        if (!id) {
            throw new Error('User ID is required');
        }
        return {
            userId: id,
            firstName: form.firstName.value || undefined,
            lastName: form.lastName.value || undefined,
            email: form.email.value || undefined,
            password: form.password.value || undefined,
            jobType: form.jobType.value || undefined,
            city: form.city.value || undefined,
            country: form.country.value || undefined,
            nationality: form.nationality.value || undefined,
            uploadedDocumentsCount: form.uploadedDocumentsCount.value || undefined
        };
    }
}

export interface PasswordResetDto {
    newPassword: string;
    confirmPassword: string;
}

export type PasswordResetFormDto = {
    newPassword: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
};
