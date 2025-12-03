import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SidebarItem {
    id: string;
    icon: string;
    label?: string;
    badge?: number;
}

@Component({
    selector: 'ad-sidebar',
    templateUrl: './ad-sidebar.component.html',
    styleUrls: ['./ad-sidebar.component.scss']
})
export class AdSidebarComponent {
    @Input() items: SidebarItem[] = [];
    @Input() activeItemId: string | null = null;
    @Output() itemClick = new EventEmitter<SidebarItem>();

    onItemClick(item: SidebarItem) {
        this.itemClick.emit(item);
    }
}
