import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ad-checkbox',
  templateUrl: './ad-checkbox.component.html',
  styleUrls: ['./ad-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdCheckboxComponent),
      multi: true
    }
  ]
})
export class AdCheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() binary: boolean = true;
  @Input() inputId: string = '';
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';

  value: boolean = false;

  onChange: any = () => { };
  onTouch: any = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(value: boolean) {
    this.value = value;
    this.onChange(value);
    this.onTouch();
  }
}
