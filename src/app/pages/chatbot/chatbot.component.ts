import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';
import { ChatSession } from 'src/app/core/dto/chatbot.model';
import { ChatbotService } from 'src/app/core/services/chatbot.service';

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, AdInputComponent, AdButtonComponent],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    // Lista per la sidebar
    sessions: ChatSession[] = [];

    // Sessione attiva completa (con messaggi)
    currentSession: ChatSession | null = null;
    currentSessionId: string | null = null;

    userMessage: string = '';
    isSidebarOpen: boolean = false;
    isTyping: boolean = false;
    isListening: boolean = false;

    // Suggerimenti statici (opzionale, visto che non arrivano dal BE per ora)
    suggestions: string[] = [
        "Qual è il netto dell'ultima busta?",
        "Quante ferie ho maturato?",
        "Spiegami le trattenute IRPEF"
    ];

    constructor(private chatbotService: ChatbotService) { }

    ngOnInit(): void {
        this.loadChatHistory();
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    /**
     * Carica la lista delle chat per la sidebar
     */
    loadChatHistory(): void {
        this.chatbotService.getHistory().subscribe({
            next: (data) => {
                this.sessions = data;
                // All'avvio apriamo una nuova chat pulita
                this.startNewChat();
            },
            error: (err) => {
                console.error('Errore caricamento storico', err);
                this.startNewChat();
            }
        });
    }

    /**
     * Inizializza lo stato per una nuova chat (non ancora salvata su DB)
     */
    startNewChat(): void {
        this.currentSession = {
            id: '', // ID vuoto = backend ne creerà uno nuovo
            title: 'Nuova Chat',
            updatedAt: new Date().toISOString(),
            messages: []
        };
        this.currentSessionId = null;
        this.isSidebarOpen = false;
    }

    /**
     * Carica una sessione specifica dal backend (click su sidebar)
     */
    loadSession(session: ChatSession): void {
        this.isSidebarOpen = false;

        // Ottimizzazione: se ho già i messaggi, non ricarico (opzionale)
        // Ma per sicurezza carichiamo sempre dal server per avere lo stato aggiornato
        this.chatbotService.getSession(session.id).subscribe({
            next: (fullSession) => {
                this.currentSession = fullSession;
                this.currentSessionId = fullSession.id;
                // Scroll dopo il rendering
                setTimeout(() => this.scrollToBottom(), 100);
            },
            error: (err) => {
                console.error('Errore caricamento sessione', err);
            }
        });
    }

    sendMessage(): void {
        if (!this.userMessage.trim()) return;

        const textToSend = this.userMessage;

        // 1. Setup UI Optimistico
        if (!this.currentSession) {
            this.startNewChat();
        }

        // Aggiungi messaggio utente alla UI
        this.currentSession!.messages.push({
            sender: 'user',
            text: textToSend,
            timestamp: new Date().toISOString()
        });

        this.userMessage = '';
        this.isTyping = true;
        this.scrollToBottom();

        // 2. Chiamata al Service
        // Passiamo currentSessionId (se è null, il BE crea nuova chat)
        this.chatbotService.sendMessage(textToSend, this.currentSessionId || undefined).subscribe({
            next: (response) => {
                this.isTyping = false;

                // Pulisci la risposta
                const cleanedText = this.cleanBotResponse(response.answer);

                // Aggiungi risposta bot alla UI
                this.currentSession!.messages.push({
                    sender: 'bot',
                    text: cleanedText,
                    timestamp: new Date().toISOString()
                });

                // 3. Gestione PRIMO messaggio di una nuova chat
                // Se non avevamo un ID, ora lo abbiamo dal backend insieme al titolo generato
                if (!this.currentSessionId) {
                    this.currentSessionId = response.sessionId;

                    // Aggiorniamo l'oggetto corrente
                    if (this.currentSession) {
                        this.currentSession.id = response.sessionId;
                        this.currentSession.title = response.title;
                        this.currentSession.updatedAt = new Date().toISOString();

                        // Aggiungiamo alla sidebar in cima
                        this.sessions.unshift(this.currentSession);
                    }
                } else {
                    // Se era una chat esistente, la spostiamo in cima alla sidebar (aggiornamento data)
                    this.updateSidebarOrder(this.currentSessionId);
                }

                this.scrollToBottom();
            },
            error: (err) => {
                this.isTyping = false;
                console.error('Errore invio messaggio', err);
                this.currentSession?.messages.push({
                    sender: 'bot',
                    text: '⚠️ Si è verificato un errore di comunicazione con il server.',
                    timestamp: new Date().toISOString()
                });
                this.scrollToBottom();
            }
        });
    }

    /**
     * Sposta la sessione attiva in cima alla lista della sidebar
     */
    private updateSidebarOrder(sessionId: string): void {
        const index = this.sessions.findIndex(s => s.id === sessionId);
        if (index > -1) {
            const session = this.sessions.splice(index, 1)[0];
            session.updatedAt = new Date().toISOString(); // Aggiorna data visiva
            this.sessions.unshift(session);
        }
    }

    /**
         * Pulisce i riferimenti ma MANTIENE e converte la formattazione Markdown (Grassetto)
         */
    private cleanBotResponse(rawText: string): string {
        if (!rawText) return '';

        // 1. Rimuove la sezione "### References" (quella la togliamo sempre)
        let text = rawText.split('### References')[0];

        // 2. Converte il grassetto Markdown (**testo**) in HTML (<strong>testo</strong>)
        // La regex cattura il testo tra i doppi asterischi
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 3. (Opzionale) Converte il corsivo (*testo*) in HTML (<em>testo</em>)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // 4. Rimuove header Markdown residui che non vogliamo visualizzare
        text = text.replace(/###/g, '');

        // 5. Converte i "newline" (\n) in <br> per andare a capo correttamente nell'HTML
        text = text.replace(/\n/g, '<br>');

        return text.trim();
    }

    useSuggestion(suggestion: string): void {
        this.userMessage = suggestion;
        this.sendMessage();
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
    }

    toggleVoiceDictation(): void {
        this.isListening = !this.isListening;
        if (this.isListening) {
            setTimeout(() => {
                this.userMessage = "Sto ascoltando (funzionalità simulata)...";
                this.isListening = false;
            }, 2000);
        }
    }

    private scrollToBottom(): void {
        try {
            if (this.scrollContainer) {
                setTimeout(() => {
                    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
                }, 50);
            }
        } catch (err) { }
    }
}