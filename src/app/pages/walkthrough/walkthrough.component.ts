import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { AdDialogComponent } from '../../toolbox/ad-dialog/ad-dialog.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';

interface Slide {
    title: string;
    description: string;
    image?: string;
    icon?: string;
}

@Component({
    selector: 'app-walkthrough',
    standalone: true,
    imports: [
        CommonModule,
        CarouselModule,
        ButtonModule,
        AdDialogComponent,
        AdButtonComponent
    ],
    templateUrl: './walkthrough.component.html',
    styleUrls: ['./walkthrough.component.scss']
})
export class WalkthroughComponent implements OnInit {
    visible: boolean = true;
    slides: Slide[] = [];

    responsiveOptions: any[] | undefined;

    constructor(private router: Router) { }

    ngOnInit() {
        this.slides = [
            {
                title: 'Benvenuto in PayPeek',
                description: 'Gestisci le tue buste paga in modo intelligente e dinamico. Un unico posto per tutti i tuoi documenti.',
                icon: 'pi pi-wallet' // Placeholder icon
            },
            {
                title: 'Caricamento del Template',
                description: 'Nella sezione "File", carica il PDF della tua busta paga per generare automaticamente il template personalizzato.',
                icon: 'pi pi-file-pdf'
            },
            {
                title: 'Caricamento Mensile',
                description: 'Carica le tue buste paga ogni mese. Il sistema estrarrà automaticamente i dati per te.',
                icon: 'pi pi-upload'
            },
            {
                title: 'Chatbot e Dashboard',
                description: 'Interagisci con il Chatbot per domande rapide e controlla la Dashboard per una visione completa dei tuoi dati.',
                icon: 'pi pi-chart-bar'
            }
        ];

        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    onClose() {
        this.visible = false;
        this.router.navigate(['/dashboard']);
    }
}
