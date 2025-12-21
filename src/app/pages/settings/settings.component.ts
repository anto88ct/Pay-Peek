import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { AdCardComponent } from '../../toolbox/ad-card/ad-card.component';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Attachment {
    file: File;
    previewUrl: SafeUrl;
    type: 'image' | 'pdf';
    name: string;
}


interface FAQ {
    question: string;
    answer: string;
}

interface Contributor {
    name: string;
    role: string;
    avatarUrl: string;
    githubUrl: string;
}

interface AITool {
    name: string;
    imageUrl: string;
}

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, AccordionModule, AdButtonComponent, AdCardComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    faqs: FAQ[] = [];
    contributors: Contributor[] = [];
    aiTools: AITool[] = [];
    supportMessage: string = '';
    attachments: Attachment[] = [];

    constructor(
        private router: Router,
        private http: HttpClient,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
        this.loadData();
    }

    loadData(): void {
        this.http.get<FAQ[]>('assets/data/faq.json').subscribe(data => {
            this.faqs = data;
        });

        this.http.get<Contributor[]>('assets/data/contributors.json').subscribe(data => {
            this.contributors = data;
        });

        this.http.get<AITool[]>('assets/data/ai-tools.json').subscribe(data => {
            this.aiTools = data;
        });
    }

    triggerFileUpload(): void {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    }

    onFileSelected(event: any): void {
        const files: FileList = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    const type = file.type.includes('image') ? 'image' : 'pdf';
                    this.attachments.push({
                        file: file,
                        previewUrl: this.sanitizer.bypassSecurityTrustUrl(e.target.result),
                        type: type,
                        name: file.name
                    });
                };

                reader.readAsDataURL(file);
            }
        }
        // Reset input value to allow selecting the same file again if needed
        event.target.value = '';
    }

    removeAttachment(index: number): void {
        this.attachments.splice(index, 1);
    }

    sendSupportEmail(): void {

        let valid = true;
        if (!this.supportMessage && this.attachments.length === 0) {
            valid = false;
        }

        if (valid) {
            alert('Support message sent! (This is a demo)');
            this.supportMessage = '';
            this.attachments = [];
        } else {
            alert('Please enter a message or attach a file.');
        }
    }

    logout(): void {
        // Clear any authentication data
        localStorage.removeItem('authToken');
        sessionStorage.clear();

        // Navigate to login
        this.router.navigate(['/auth/login']);
    }
}
