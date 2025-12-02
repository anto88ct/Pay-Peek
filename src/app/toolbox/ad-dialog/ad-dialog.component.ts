import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ad-dialog',
  templateUrl: './ad-dialog.component.html',
  styleUrls: ['./ad-dialog.component.scss']
})
export class AdDialogComponent {
  @Input() visible: boolean = false;
  @Input() header: string = '';
  @Input() modal: boolean = true;
  @Input() style: any = { width: '50vw' };
  @Input() draggable: boolean = false;
  @Input() resizable: boolean = false;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onHide = new EventEmitter<any>();

  onHideHandler(event: any) {
    this.visibleChange.emit(false);
    this.onHide.emit(event);
  }
}
