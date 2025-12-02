import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ad-button',
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
  @Input() severity: string = 'primary'; // primary, secondary, success, info, warning, danger
  @Input() outlined: boolean = false;
  @Input() size: 'small' | 'large' | undefined = undefined; // small, large, undefined (medium)

  @Output() onClick = new EventEmitter<any>();

  handleClick(event: any) {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
}
