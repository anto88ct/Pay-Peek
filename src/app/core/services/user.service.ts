import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserDto, ProfileUpdateDto } from '../dto/user.dto';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseService {
    private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(http: HttpClient) {
        super(http);
        this.loadUserFromStorage();
    }

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

    getProfile(userId: string): Observable<UserDto> {
        return this.get<UserDto>(`/users/profile/${userId}`).pipe(
            tap(user => {
                this.updateLocalUser(user);
            })
        );
    }


    getCurrentUserSync(): UserDto | null {
        return this.currentUserSubject.value;
    }

    updateProfile(updates: ProfileUpdateDto): Observable<UserDto> {
        return this.put<UserDto>('/users/update/profile', updates).pipe(
            tap(updatedUser => {
                this.updateLocalUser(updatedUser);
            })
        );
    }

    uploadProfileImage(file: File, userId: string): Observable<UserDto> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId || '');
        return this.post<UserDto>('/users/profile/image', formData).pipe(
            tap(updatedUser => {
                this.updateLocalUser(updatedUser);
            })
        );
    }

    removeProfileImage(): Observable<UserDto> {
        return this.delete<UserDto>('/users/profile/image').pipe(
            tap(updatedUser => {
                this.updateLocalUser(updatedUser);
            })
        );
    }

    clearUser(): void {
        this.currentUserSubject.next(null);
        localStorage.removeItem('current_user');
    }

    updateTheme(theme: string): Observable<UserDto> {
        const userId = this.getCurrentUserSync()?.id;
        const url = `/users/preferences/${userId}/theme?theme=${theme}`;

        return this.patch<UserDto>(url, {}).pipe(
            tap(updatedUser => {
                this.updateLocalUser(updatedUser);
            })
        );
    }

    updateLanguage(language: string): Observable<UserDto> {
        const userId = this.getCurrentUserSync()?.id;
        const url = `/users/preferences/${userId}/language?language=${language}`;

        return this.patch<UserDto>(url, {}).pipe(
            tap(updatedUser => {
                this.updateLocalUser(updatedUser);
            })
        );
    }

    private updateLocalUser(user: UserDto): void {
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
