import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-files',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4"><h2>Files</h2><p>Files works!</p></div>`,
    styles: []
})
export class FilesComponent { }
