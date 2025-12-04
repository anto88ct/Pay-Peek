import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BottomNavItem {
    id: string;
    icon: string; // FontAwesome class, e.g., 'fa-solid fa-home'
    label?: string;
    badge?: number;
}

@Component({
    selector: 'ad-bottom-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ad-bottom-nav.component.html',
    styleUrls: ['./ad-bottom-nav.component.scss']
})
export class AdBottomNavComponent {
    @Input() items: BottomNavItem[] = [];
    @Input() activeItemId: string | null = null;
    @Output() itemClick = new EventEmitter<BottomNavItem>();

    onItemClick(item: BottomNavItem) {
        this.itemClick.emit(item);
    }
}
