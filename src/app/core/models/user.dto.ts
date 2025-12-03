// src/app/core/models/user.dto.ts
import { User } from './user.model';

/**
 * Extended User DTO for profile management
 * Includes additional fields for authentication and profile display
 */
export interface UserDto extends User {
    password?: string;              // Password (will be obfuscated in UI)
    passkey?: string;               // Passkey/PIN (will be obfuscated in UI)
    uploadedDocumentsCount?: number; // Number of documents uploaded
    nationality?: string;            // User nationality
    profileImageBase64?: string;     // Base64 encoded profile image for local storage
}

/**
 * Profile update request DTO
 * Contains only editable fields
 */
export interface ProfileUpdateDto {
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
}
