import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ad-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './ad-button.component.html',
  styleUrls: ['./ad-button.component.scss']
})
export class AdButtonComponent {
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() type: string = 'button';
  @Input() styleClass: string = '';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() severity: string = 'primary';
  @Input() outlined: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined;
  @Input() customSeverity?: 'custom-blue' | 'custom-green' | 'custom-orange' | 'custom-red' | 'custom-yellow' | 'custom-purple';
  @Input() transparent: boolean = false;

  @Output() onClick = new EventEmitter<any>();

  handleClick(event: any) {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }

  getButtonClasses(): string {
    const base = 'w-full custom-border-radius';
    let severityClass = '';

    if (this.customSeverity) {
      severityClass = `p-button-${this.customSeverity}`;
    } else if (this.severity && this.severity !== 'primary') {
      severityClass = `p-button-${this.severity}`;
    }

    const classes = severityClass ? `${base} ${severityClass}` : base;

    return this.styleClass ? `${classes} ${this.styleClass}` : classes;
  }

}
