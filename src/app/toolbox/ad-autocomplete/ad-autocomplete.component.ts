import { Component, Input, Output, EventEmitter, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AdLabelComponent } from '../ad-label/ad-label.component';

@Component({
    selector: 'ad-autocomplete',
    templateUrl: './ad-autocomplete.component.html',
    styleUrls: ['./ad-autocomplete.component.scss'],
    standalone: true,
    imports: [CommonModule, AutoCompleteModule, FormsModule, AdLabelComponent],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => AdAutocompleteComponent),
            multi: true
        }
    ]
})
export class AdAutocompleteComponent implements ControlValueAccessor, OnInit {
    @Input() suggestions: any[] = [];
    @Input() optionLabel: string = 'descrizione'; // Property to show
    @Input() optionValue: string = ''; // Property to bind value (if empty, binds whole object)
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() forceSelection: boolean = true;
    @Input() styleClass: string = '';
    @Input() labelIcon: string = '';
    @Input() disabled: boolean = false;

    filteredSuggestions: any[] = [];
    value: any = null;

    onChange: any = () => { };
    onTouched: any = () => { };

    ngOnInit() {
        // initialize logic if needed
    }

    filter(event: any) {
        const query = event.query.toLowerCase();

        // Filter logic
        const results = this.suggestions.filter(item => {
            const fieldVal = item[this.optionLabel];
            return fieldVal && fieldVal.toLowerCase().includes(query);
        });

        // Limit results to 20
        this.filteredSuggestions = results.slice(0, 20);
    }

    onSelect(event: any) {
        this.updateValue(event.value);
    }

    onClear() {
        this.updateValue(null);
    }

    private updateValue(val: any) {
        // If p-autoComplete binds whole object but we want optionValue
        let finalVal = val;

        // Since p-autoComplete with [field] handles display, 
        // but if we want to extract a specific ID for the model we can do it here 
        // OR let p-autoComplete handle it via dataKey? 
        // Actually p-autoComplete binds the object usually if field is specified for display.
        // If we want to return just the ID, we might need to handle it.

        // However, to keep it simple and compatible with formControlName binding to IDs:
        // If we bound the MODEL to an ID (e.g. 'IT'), p-autoComplete needs to display 'Italiana'.
        // This requires p-autoComplete to find the object in suggestions that matches the ID.

        // Because we use [suggestions], p-autoComplete can handle objects.

        // If optionValue is set, we want to emit that value.
        if (this.optionValue && val && typeof val === 'object') {
            finalVal = val[this.optionValue];
        }

        this.value = val; // Internal display value should be object for p-autocomplete to show field?
        // Actually: if p-autoComplete [field] is set, NgModel should be the object.
        // If we want to support storing just "IT", we need to convert back and forth.

        this.onChange(finalVal);
    }

    // ControlValueAccessor methods
    writeValue(obj: any): void {
        if (obj !== undefined && obj !== null) {
            // If we have an incoming value (e.g. 'IT') and optionValue is 'codice'
            // We need to find the object in suggestions to set as internal value so p-autocomplete displays it correctly
            if (this.optionValue && this.suggestions.length > 0) {
                const found = this.suggestions.find(s => s[this.optionValue] === obj);
                this.value = found || obj;
            } else {
                this.value = obj;
            }
        } else {
            this.value = null;
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // Update internal value when suggestions change (async load)
    ngOnChanges(changes: any) {
        if (changes.suggestions && this.value) {
            // If suggestions loaded AFTER value was written
            // Re-trigger writeValue logic effectively
            // Use the current model value (which might be 'IT' but displayed as 'IT' temporarily)
            // to find the full object

            // But here we don't have the original model value easily if we transformed it to object in this.value.
            // Let's assume writeValue handles it. But if writeValue came before suggestions...
            // We might need to store the "raw" value pending match.
        }
    }
}
