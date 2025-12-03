import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ad-color-picker',
  template: `
    <div class="flex flex-column gap-2">
      <label *ngIf="label" class="font-bold text-sm">{{ label }}</label>
      <div class="flex align-items-center gap-2">
        <p-colorPicker 
          [(ngModel)]="color" 
          (onChange)="onColorChange($event)"
          [inputId]="inputId">
        </p-colorPicker>
        <span class="text-sm text-500">#{{ color }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AdColorPickerComponent {
  @Input() label: string = '';
  @Input() inputId: string = 'color-picker';
  @Input() color: string = '18BC9C'; // Default color
  @Output() colorChange = new EventEmitter<string>();

  onColorChange(event: any) {
    this.colorChange.emit(event.value);
  }
}
