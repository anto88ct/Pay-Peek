import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ad-month-picker',
  standalone: true,
  imports: [CommonModule, CalendarModule, FormsModule],
  template: `
    <div class="flex flex-column gap-2">
      <label *ngIf="label" class="font-bold text-sm">{{ label }}</label>
      <p-calendar 
        [(ngModel)]="monthDate" 
        view="month" 
        dateFormat="mm/yy" 
        [inputId]="inputId"
        (onSelect)="onMonthSelect($event)"
        [showIcon]="true"
        styleClass="w-full"
        inputStyleClass="w-full"
        placeholder="Select Month">
      </p-calendar>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    ::ng-deep .p-calendar {
      width: 100%;
    }
    ::ng-deep .p-inputtext {
      width: 100%;
    }
  `]
})
export class AdMonthPickerComponent {
  @Input() label: string = '';
  @Input() inputId: string = 'month-picker';
  @Input() month: number | null = null; // 1-12
  @Output() monthChange = new EventEmitter<number>();

  monthDate: Date | null = null;

  ngOnChanges() {
    if (this.month) {
      const date = new Date();
      date.setMonth(this.month - 1);
      this.monthDate = date;
    }
  }

  onMonthSelect(event: Date) {
    this.monthChange.emit(event.getMonth() + 1);
  }
}
