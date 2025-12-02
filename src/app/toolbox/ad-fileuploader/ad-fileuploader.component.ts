import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ad-fileuploader',
  templateUrl: './ad-fileuploader.component.html',
  styleUrls: ['./ad-fileuploader.component.scss']
})
export class AdFileUploaderComponent {
  @Input() name: string = 'file';
  @Input() url: string = '';
  @Input() mode: 'basic' | 'advanced' = 'advanced';
  @Input() accept: string = '';
  @Input() maxFileSize: number = 1000000;
  @Input() auto: boolean = false;
  @Input() multiple: boolean = false;
  @Input() chooseLabel: string = 'Choose';
  @Input() uploadLabel: string = 'Upload';
  @Input() cancelLabel: string = 'Cancel';

  @Output() onUpload = new EventEmitter<any>();
  @Output() onError = new EventEmitter<any>();
  @Output() onSelect = new EventEmitter<any>();

  handleUpload(event: any) {
    this.onUpload.emit(event);
  }

  handleError(event: any) {
    this.onError.emit(event);
  }

  handleSelect(event: any) {
    this.onSelect.emit(event);
  }
}
