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
import { InputSwitchModule } from 'primeng/inputswitch';

import { AdButtonComponent } from './ad-button/ad-button.component';
import { AdDialogComponent } from './ad-dialog/ad-dialog.component';
import { AdFileUploaderComponent } from './ad-fileuploader/ad-fileuploader.component';
import { AdInputComponent } from './ad-input/ad-input.component';
import { AdCheckboxComponent } from './ad-checkbox/ad-checkbox.component';
import { AdDropdownComponent } from './ad-dropdown/ad-dropdown.component';
import { AdMultiSelectComponent } from './ad-multiselect/ad-multiselect.component';
import { AdBottomNavComponent } from './ad-bottom-nav/ad-bottom-nav.component';
import { AdSidebarComponent } from './ad-sidebar/ad-sidebar.component';
import { AdLabelComponent } from './ad-label/ad-label.component';
import { AdYearPickerComponent } from './ad-year-picker/ad-year-picker.component';
import { AdMonthPickerComponent } from './ad-month-picker/ad-month-picker.component';
import { AdColorPickerComponent } from './ad-color-picker/ad-color-picker.component';
import { AdInputSwitchComponent } from './ad-input-switch/ad-input-switch.component';

import { CalendarModule } from 'primeng/calendar';
import { ColorPickerModule } from 'primeng/colorpicker';

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
    AdSidebarComponent,
    AdLabelComponent,
    AdYearPickerComponent,
    AdMonthPickerComponent,
    AdColorPickerComponent,
    AdInputSwitchComponent
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
    MultiSelectModule,
    CalendarModule,
    ColorPickerModule,
    InputSwitchModule
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
    AdLabelComponent,
    AdSidebarComponent,
    AdYearPickerComponent,
    AdMonthPickerComponent,
    AdColorPickerComponent,
    AdInputSwitchComponent
  ]
})
export class ToolboxModule { }
