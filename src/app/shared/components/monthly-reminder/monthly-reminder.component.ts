import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { Reminder } from '../../../core/dto/reminder.dto';

@Component({
    selector: 'app-monthly-reminder',
    standalone: true, // Make it standalone
    imports: [CommonModule], // Add CommonModule to imports
    templateUrl: './monthly-reminder.component.html',
    styleUrls: ['./monthly-reminder.component.scss']
})
export class MonthlyReminderComponent {
    @Input() reminder: Reminder | null = null;
}
