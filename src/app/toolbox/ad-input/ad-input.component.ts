import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AdLabelComponent } from '../ad-label/ad-label.component';

@Component({
  selector: 'ad-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputTextModule, AdLabelComponent],
  templateUrl: './ad-input.component.html',
  styleUrls: ['./ad-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdInputComponent),
      multi: true
    }
  ]
})
export class AdInputComponent implements ControlValueAccessor {
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';
  @Input() inputIcon: string = '';
  @Input() labelIcon: string = '';
  @Input() readonly: boolean = false;
  @Input() showPasswordToggle: boolean = false;
  @Output() inputChange = new EventEmitter<string>();

  value: string = '';
  showPassword = false;

  onChange: any = () => { };
  onTouch: any = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any) {
    if (this.readonly || this.disabled) {
      return;
    }
    this.value = event.target.value;
    this.onChange(this.value);
    this.onTouch();
    this.inputChange.emit(this.value);
  }
}
