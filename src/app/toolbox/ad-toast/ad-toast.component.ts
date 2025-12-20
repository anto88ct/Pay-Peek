import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-ad-toast',
    standalone: true,
    imports: [CommonModule, ToastModule],
    templateUrl: './ad-toast.component.html',
    styleUrls: ['./ad-toast.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdToastComponent {
    @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' | 'center' = 'top-right';
    @Input() key?: string;
}
