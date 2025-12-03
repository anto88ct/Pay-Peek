import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ad-year-picker',
  template: `
    <div class="flex flex-column gap-2">
      <label *ngIf="label" class="font-bold text-sm">{{ label }}</label>
      <p-calendar 
        [(ngModel)]="yearDate" 
        view="year" 
        dateFormat="yy" 
        [inputId]="inputId"
        (onSelect)="onYearSelect($event)"
        [showIcon]="true"
        styleClass="w-full"
        inputStyleClass="w-full"
        placeholder="Select Year">
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
export class AdYearPickerComponent {
  @Input() label: string = '';
  @Input() inputId: string = 'year-picker';
  @Input() year: number | null = null;
  @Output() yearChange = new EventEmitter<number>();

  yearDate: Date | null = null;

  ngOnChanges() {
    if (this.year) {
      const date = new Date();
      date.setFullYear(this.year);
      this.yearDate = date;
    }
  }

  onYearSelect(event: Date) {
    this.yearChange.emit(event.getFullYear());
  }
}
