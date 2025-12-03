// src/app/core/services/user.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDto, ProfileUpdateDto } from '../models/user.dto';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor() {
        // Load user from localStorage on initialization
        this.loadUserFromStorage();
    }

    /**
     * Load user data from localStorage
     */
    private loadUserFromStorage(): void {
        const userStr = localStorage.getItem('current_user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr) as UserDto;
                this.currentUserSubject.next(user);
            } catch (e) {
                console.error('Error loading user from storage:', e);
            }
        }
    }

    /**
     * Get current user profile
     */
    getProfile(): Observable<UserDto | null> {
        return this.currentUser$;
    }

    /**
     * Get current user synchronously
     */
    getCurrentUserSync(): UserDto | null {
        return this.currentUserSubject.value;
    }

    /**
     * Update user profile
     * In a real app, this would make an API call
     */
    updateProfile(updates: ProfileUpdateDto): Observable<UserDto> {
        return new Observable(observer => {
            const currentUser = this.currentUserSubject.value;
            if (!currentUser) {
                observer.error(new Error('No user logged in'));
                return;
            }

            // Merge updates with current user data
            const updatedUser: UserDto = {
                ...currentUser,
                ...updates
            };

            // Save to localStorage
            localStorage.setItem('current_user', JSON.stringify(updatedUser));
            this.currentUserSubject.next(updatedUser);

            observer.next(updatedUser);
            observer.complete();
        });
    }

    /**
     * Upload profile image (fictitious - stores base64 in localStorage)
     * @param file Image file to upload
     * @returns Observable with updated user data
     */
    uploadProfileImage(file: File): Observable<UserDto> {
        return new Observable(observer => {
            // Validate file type
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (!validTypes.includes(file.type)) {
                observer.error(new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.'));
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024;
            if (file.size > maxSize) {
                observer.error(new Error('File size exceeds 5MB limit.'));
                return;
            }

            // Convert to base64
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;

                // Update user with new image
                this.updateProfile({ profileImageBase64: base64 }).subscribe({
                    next: (updatedUser) => {
                        observer.next(updatedUser);
                        observer.complete();
                    },
                    error: (error) => observer.error(error)
                });
            };

            reader.onerror = () => {
                observer.error(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Remove profile image
     */
    removeProfileImage(): Observable<UserDto> {
        return this.updateProfile({ profileImageBase64: '' });
    }

    /**
     * Clear user data (on logout)
     */
    clearUser(): void {
        this.currentUserSubject.next(null);
    }
}
