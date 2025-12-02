import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolboxModule } from '../toolbox/toolbox.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ToolboxModule
  ],
  exports: [
    CommonModule,
    ToolboxModule
  ]
})
export class SharedModule { }
