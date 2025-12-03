import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule],
    template: `<div class="p-4"><h2>Chatbot</h2><p>Chatbot works!</p></div>`,
    styles: []
})
export class ChatbotComponent { }
