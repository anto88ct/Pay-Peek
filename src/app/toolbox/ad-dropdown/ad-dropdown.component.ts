import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ad-dropdown',
  templateUrl: './ad-dropdown.component.html',
  styleUrls: ['./ad-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdDropdownComponent),
      multi: true
    }
  ]
})
export class AdDropdownComponent implements ControlValueAccessor {
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;

  value: any = null;

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

  onModelChange(value: any) {
    this.value = value;
    this.onChange(value);
    this.onTouch();
  }
}
