import { Component } from '@angular/core';

@Component({
  selector: 'app-test-components',
  templateUrl: './test-components.component.html',
  styleUrls: ['./test-components.component.scss']
})
export class TestComponentsComponent {
  dialogVisible: boolean = false;
  checkboxValue: boolean = false;
  inputValue: string = '';
  dropdownValue: any = null;
  multiSelectValue: any[] = [];

  dropdownOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
  ];

  showDialog() {
    this.dialogVisible = true;
  }

  onButtonClick() {
    console.log('Button clicked');
  }

  onUpload(event: any) {
    console.log('Upload', event);
  }
}
