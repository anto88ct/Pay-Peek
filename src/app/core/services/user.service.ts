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

    getProfile(): Observable<UserDto> {
        return this.get<UserDto>('/users/profile').pipe(
            tap(user => {
                this.updateLocalUser(user);
            })
        );
    }

    getCurrentUserSync(): UserDto | null {
        return this.currentUserSubject.value;
    }

    updateProfile(updates: ProfileUpdateDto): Observable<UserDto> {
        return this.put<UserDto>('/users/profile', updates).pipe(
            tap(updatedUser => {
                this.updateLocalUser(updatedUser);
            })
        );
    }

    uploadProfileImage(file: File): Observable<UserDto> {
        const formData = new FormData();
        formData.append('file', file);
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

    private updateLocalUser(user: UserDto): void {
        localStorage.setItem('current_user', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }
}
