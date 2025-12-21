import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ClientError } from '../dto/error-response.dto';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor(private messageService: MessageService) { }

    /**
     * Shows a success toast message
     * @param message Message to display
     * @param title Title of the toast (optional)
     */
    showSuccess(message: string, title: string = 'Successo') {
        this.messageService.add({ severity: 'success', summary: title, detail: message, life: 3000 });
    }

    /**
     * Shows an info toast message
     * @param message Message to display
     * @param title Title of the toast (optional)
     */
    showInfo(message: string, title: string = 'Info') {
        this.messageService.add({ severity: 'info', summary: title, detail: message, life: 3000 });
    }

    /**
     * Shows a warning toast message
     * @param message Message to display
     * @param title Title of the toast (optional)
     */
    showWarn(message: string, title: string = 'Attenzione') {
        this.messageService.add({ severity: 'warn', summary: title, detail: message, life: 3000 });
    }

    /**
     * Shows an error toast message from a ClientError object or string
     * @param error object or error message string
     * @param title Title of the toast (optional)
     */
    showError(error: any, title: string = 'Errore') {
        const message = error?.message || 'Si è verificato un errore sconosciuto';
        this.messageService.add({ severity: 'error', summary: title, detail: message, life: 5000 });
    }
}
