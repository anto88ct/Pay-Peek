import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

export interface MenuItem {
  label: string;
  icon?: string;
  command?: () => void;
  value?: any;
}

@Component({
  selector: 'ad-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule],
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
  // Standard dropdown inputs
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';
  @Input() showClear: boolean = false;
  @Input() filter: boolean = false;

  // Profile menu mode inputs
  @Input() mode: 'standard' | 'profile' = 'standard';
  @Input() menuItems: MenuItem[] = [];
  @Input() profileName: string = '';
  @Input() profileImage: string = '';
  @Output() itemClick = new EventEmitter<MenuItem>();

  value: any = null;
  menuVisible: boolean = false;

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

  toggleMenu(): void {
    if (!this.disabled) {
      this.menuVisible = !this.menuVisible;
    }
  }

  onMenuItemClick(item: MenuItem): void {
    this.menuVisible = false;
    if (item.command) {
      item.command();
    }
    this.itemClick.emit(item);
  }

  closeMenu(): void {
    this.menuVisible = false;
  }
}
