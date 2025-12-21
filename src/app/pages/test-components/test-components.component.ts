import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdCheckboxComponent } from '../../toolbox/ad-checkbox/ad-checkbox.component';
import { AdDropdownComponent } from '../../toolbox/ad-dropdown/ad-dropdown.component';
import { AdMultiSelectComponent } from '../../toolbox/ad-multiselect/ad-multiselect.component';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdFileUploaderComponent } from '../../toolbox/ad-fileuploader/ad-fileuploader.component';
import { AdCardComponent } from '../../toolbox/ad-card/ad-card.component';

@Component({
  selector: 'app-test-components',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdButtonComponent,
    AdInputComponent,
    AdCheckboxComponent,
    AdDropdownComponent,
    AdMultiSelectComponent,
    AdDialogComponent,
    AdFileUploaderComponent,
    AdCardComponent
  ],
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
  }

  onUpload(event: any) {
  }
}
