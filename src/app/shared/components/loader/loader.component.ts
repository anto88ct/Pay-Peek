import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../../core/services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule, ProgressSpinnerModule],
    template: `
    <div *ngIf="loading$ | async" class="loader-overlay">
      <p-progressSpinner ariaLabel="loading"></p-progressSpinner>
    </div>
  `,
    styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
      z-index: 9999; /* High z-index to block everything */
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(2px); /* Optional blur effect */
    }
  `]
})
export class LoaderComponent {
    loading$ = this.loaderService.loading$;

    constructor(private loaderService: LoaderService) { }
}
