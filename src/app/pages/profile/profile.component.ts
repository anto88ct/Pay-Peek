import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4"><h2>Profile</h2><p>Profile works!</p></div>`,
    styles: []
})
export class ProfileComponent { }
