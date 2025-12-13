
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
    selector: 'ad-chiplist',
    standalone: true,
    imports: [CommonModule, FormsModule, MultiSelectModule],
    templateUrl: './ad-chiplist.component.html',
    styleUrls: ['./ad-chiplist.component.scss']
})
export class AdChiplistComponent {
    @Input() options: any[] = [];
    @Input() placeholder: string = 'Select items';
    @Input() optionLabel: string = 'label';
    @Input() display: string = 'chip';
    @Input() filter: boolean = true;
    @Input() showClear: boolean = false;

    @Input() selectedItems: any[] = [];
    @Output() selectedItemsChange = new EventEmitter<any[]>();

    onSelectionChange(value: any) {
        this.selectedItems = value;
        this.selectedItemsChange.emit(this.selectedItems);
    }
}
