import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { HttpClient } from '@angular/common/http';

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
    imports: [CommonModule, FormsModule, TranslateModule, AccordionModule, AdInputComponent, AdButtonComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    faqs: FAQ[] = [];
    contributors: Contributor[] = [];
    aiTools: AITool[] = [];
    supportMessage: string = '';

    constructor(
        private router: Router,
        private http: HttpClient
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

    sendSupportEmail(): void {
        // In a real application, this would send an email
        console.log('Support message:', this.supportMessage);
        alert('Support message sent! (This is a demo)');
        this.supportMessage = '';
    }

    logout(): void {
        // Clear any authentication data
        localStorage.removeItem('authToken');
        sessionStorage.clear();

        // Navigate to login
        this.router.navigate(['/auth/login']);
    }
}
