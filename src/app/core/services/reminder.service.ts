import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reminder } from '../dto/reminder.dto';
import { environment } from '../../../enviroments/enviroment';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
})
export class ReminderService extends BaseService {

    getUserReminder(userId: string): Observable<Reminder[]> {
        return this.get<Reminder[]>(`/reminder/${userId}`);
    }
}
