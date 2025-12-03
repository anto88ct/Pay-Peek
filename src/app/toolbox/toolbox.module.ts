import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

import { AdButtonComponent } from './ad-button/ad-button.component';
import { AdDialogComponent } from './ad-dialog/ad-dialog.component';
import { AdFileUploaderComponent } from './ad-fileuploader/ad-fileuploader.component';
import { AdInputComponent } from './ad-input/ad-input.component';
import { AdCheckboxComponent } from './ad-checkbox/ad-checkbox.component';
import { AdDropdownComponent } from './ad-dropdown/ad-dropdown.component';
import { AdMultiSelectComponent } from './ad-multiselect/ad-multiselect.component';
import { AdBottomNavComponent } from './ad-bottom-nav/ad-bottom-nav.component';
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';

@NgModule({
  declarations: [
    AdButtonComponent,
    AdDialogComponent,
    AdFileUploaderComponent,
    AdInputComponent,
    AdCheckboxComponent,
    AdDropdownComponent,
    AdMultiSelectComponent,
    AdBottomNavComponent,
    AdSidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    MultiSelectModule
  ],
  exports: [
    AdButtonComponent,
    AdDialogComponent,
    AdFileUploaderComponent,
    AdInputComponent,
    AdCheckboxComponent,
    AdDropdownComponent,
    AdMultiSelectComponent,
    AdBottomNavComponent,
    AdSidebarComponent
  ]
})
export class ToolboxModule { }
