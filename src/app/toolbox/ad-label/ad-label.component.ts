import { Component, Input } from '@angular/core';

@Component({
  selector: 'ad-label',
  templateUrl: './ad-label.component.html',
  styleUrls: ['./ad-label.component.scss']
})
export class AdLabelComponent {
  @Input() icon: string = "fa-solid fa-user";
  @Input() label: string = "Label";
}
