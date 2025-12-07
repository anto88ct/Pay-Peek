import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { AdCardComponent } from '../../../toolbox/ad-card/ad-card.component';
import { AdDialogComponent } from '../../../toolbox/ad-dialog/ad-dialog.component';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [CommonModule, TranslateModule, AdButtonComponent, AdCardComponent],
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent {

    constructor(private router: Router) { }

    accept() {
        this.router.navigate(['/auth/signup']);
    }

    cancel() {
        this.router.navigate(['/auth/login']);
    }
}
