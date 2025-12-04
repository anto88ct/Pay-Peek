import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ad-label',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ad-label.component.html',
  styleUrls: ['./ad-label.component.scss']
})
export class AdLabelComponent {
  @Input() icon: string = "fa-solid fa-user";
  @Input() label: string = "Label";
}
