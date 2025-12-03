import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4"><h2>Settings</h2><p>Settings works!</p></div>`,
    styles: []
})
export class SettingsComponent { }
