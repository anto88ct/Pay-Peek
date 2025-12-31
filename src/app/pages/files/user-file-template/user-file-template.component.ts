import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../../../core/services/file.service';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { NotificationService } from '../../../core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';
import { PayrollTemplate } from 'src/app/core/dto/payroll-template.dto';

@Component({
    selector: 'app-user-file-template',
    standalone: true,
    imports: [CommonModule, AdButtonComponent],
    templateUrl: './user-file-template.component.html',
    styleUrls: ['./user-file-template.component.scss']
})
export class UserFileTemplateComponent implements OnInit {
    @Output() templateStatus = new EventEmitter<boolean>();
    @Output() onViewDetails = new EventEmitter<any>();
    @Output() onUploadTemplate = new EventEmitter<void>();

    templateData: any = null;
    loading: boolean = true;
    error: boolean = false;
    userId: string = '';

    constructor(
        private fileService: FileService,
        private notificationService: NotificationService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.getCurrentUser();
        this.refreshStatus();
    }

    getCurrentUser() {
        this.userService.currentUser$.subscribe({
            next: (data) => {
                if (data) {
                    this.userId = data.id;
                } else {
                    this.notificationService.showError('Impossibile ottenere l\'utente corrente');
                }
            },
            error: (err) => this.notificationService.showError(err)
        });
    }

    refreshStatus() {
        this.loading = true;
        this.fileService.getUserFileTemplate(this.userId).subscribe({
            next: (data: PayrollTemplate[]) => {
                // Se la lista ha elementi, prendiamo il primo come template attivo
                this.templateData = data && data.length > 0 ? data[0] : null;
                this.loading = false;
                this.error = false;
                this.templateStatus.emit(!!this.templateData);
            },
            error: (err) => {
                this.templateData = null;
                this.loading = false;
                this.error = true;
                this.templateStatus.emit(false);
            }
        });
    }

    viewDetails() {
        this.onViewDetails.emit(this.templateData);
    }

    uploadTemplate() {
        this.onUploadTemplate.emit();
    }
}
