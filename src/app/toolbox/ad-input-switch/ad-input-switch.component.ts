import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ad-input-switch',
    templateUrl: './ad-input-switch.component.html',
    styleUrls: ['./ad-input-switch.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AdInputSwitchComponent),
            multi: true
        }
    ]
})
export class AdInputSwitchComponent implements ControlValueAccessor {
    @Input() checked: boolean = false;
    @Input() disabled: boolean = false;
    @Input() label: string = '';
    @Input() iconOn: string = 'fa-sun';
    @Input() iconOff: string = 'fa-moon';
    @Input() styleClass: string = '';
    @Output() checkedChange = new EventEmitter<boolean>();

    onChange: any = () => { };
    onTouch: any = () => { };

    writeValue(value: boolean): void {
        this.checked = value;
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

    toggle(): void {
        if (this.disabled) {
            return;
        }
        this.checked = !this.checked;
        this.onChange(this.checked);
        this.onTouch();
        this.checkedChange.emit(this.checked);
    }
}
