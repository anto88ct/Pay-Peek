import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ad-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ad-card.component.html',
    styleUrls: ['./ad-card.component.scss']
})
export class AdCardComponent {
    @Input() styleClass: string = '';
    @Input() padding: 'none' | 'small' | 'medium' | 'large' | 'custom' = 'medium';
    @Input() shadow: 'none' | 'small' | 'medium' | 'large' = 'none';
    @Input() borderRadius: 'none' | 'small' | 'medium' | 'large' | 'xl' = 'large';
    @Input() hoverable: boolean = false;
    @Input() clickable: boolean = false;
    @Input() colorStrip: string = '';
    @Input() background: 'default' | 'transparent' | 'custom' = 'default';
    @Input() border: boolean = false;

    @Output() onClick = new EventEmitter<any>();

    handleClick(event: any) {
        if (this.clickable) {
            this.onClick.emit(event);
        }
    }

    getCardClasses(): string {
        const classes = ['ad-card'];

        // Padding
        classes.push(`ad-card--padding-${this.padding}`);

        // Shadow
        if (this.shadow !== 'none') {
            classes.push(`ad-card--shadow-${this.shadow}`);
        }

        // Border radius
        if (this.borderRadius !== 'none') {
            classes.push(`ad-card--radius-${this.borderRadius}`);
        }

        // Background
        classes.push(`ad-card--bg-${this.background}`);

        // Hoverable
        if (this.hoverable) {
            classes.push('ad-card--hoverable');
        }

        // Clickable
        if (this.clickable) {
            classes.push('ad-card--clickable');
        }

        // Border
        if (this.border) {
            classes.push('ad-card--border');
        }

        // Custom classes
        if (this.styleClass) {
            classes.push(this.styleClass);
        }

        return classes.join(' ');
    }
}
