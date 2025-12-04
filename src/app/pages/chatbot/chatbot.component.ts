import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AdInputComponent } from '../../toolbox/ad-input/ad-input.component';
import { AdButtonComponent } from '../../toolbox/ad-button/ad-button.component';

interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

interface Session {
    id: string;
    title: string;
    date: string;
    messages: Message[];
}

interface ChatHistory {
    sessions: Session[];
    suggestions: string[];
}

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslateModule, AdInputComponent, AdButtonComponent],
    templateUrl: './chatbot.component.html',
    styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
    @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

    chatHistory: ChatHistory | null = null;
    currentSession: Session | null = null;
    userMessage: string = '';
    isSidebarOpen: boolean = false;
    isTyping: boolean = false;
    isListening: boolean = false;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.loadChatHistory();
    }

    ngAfterViewChecked(): void {
        this.scrollToBottom();
    }

    loadChatHistory(): void {
        this.http.get<ChatHistory>('assets/data/fake-chat-history.json').subscribe(data => {
            this.chatHistory = data;
            if (this.chatHistory.sessions.length > 0) {
                this.currentSession = this.chatHistory.sessions[0];
            } else {
                this.startNewChat();
            }
        });
    }

    startNewChat(): void {
        const newSession: Session = {
            id: Date.now().toString(),
            title: 'Nuova Chat',
            date: new Date().toISOString(),
            messages: []
        };

        if (this.chatHistory) {
            this.chatHistory.sessions.unshift(newSession);
        }
        this.currentSession = newSession;
        this.isSidebarOpen = false; // Close sidebar on mobile when starting new chat
    }

    loadSession(session: Session): void {
        this.currentSession = session;
        this.isSidebarOpen = false; // Close sidebar on mobile when selecting chat
    }

    sendMessage(): void {
        if (!this.userMessage.trim() || !this.currentSession) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: this.userMessage,
            timestamp: new Date().toISOString()
        };

        this.currentSession.messages.push(newMessage);
        this.userMessage = '';
        this.isTyping = true;

        // Mock bot response
        setTimeout(() => {
            this.isTyping = false;
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'bot',
                text: 'Questa è una risposta automatica simulata. In futuro sarò collegato a un vero motore AI!',
                timestamp: new Date().toISOString()
            };
            this.currentSession?.messages.push(botResponse);

            // Update title if it's the first message
            if (this.currentSession?.messages.length === 2 && this.currentSession.title === 'Nuova Chat') {
                this.currentSession.title = newMessage.text.substring(0, 30) + (newMessage.text.length > 30 ? '...' : '');
            }

        }, 1500);
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
            // Mock listening
            setTimeout(() => {
                this.userMessage = "Esempio di testo dettato...";
                this.isListening = false;
            }, 2000);
        }
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}
