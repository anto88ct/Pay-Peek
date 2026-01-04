import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // 'of' usato solo per mock temporanei se mancano endpoint
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { ChatRequest, ChatResponse, ChatSession } from '../dto/chatbot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService extends BaseService {

  // Recupera la lista per la sidebar
  getHistory(): Observable<ChatSession[]> {
    return this.get<ChatSession[]>('/chat/history');
  }

  // Recupera i messaggi di una chat specifica
  getSession(id: string): Observable<ChatSession> {
    return this.get<ChatSession>(`/chat/session/${id}`);
  }

  // Invia messaggio (con sessionId opzionale)
  sendMessage(query: string, sessionId?: string): Observable<ChatResponse> {
    const payload: ChatRequest = { query, sessionId };
    const headers = new HttpHeaders({ 'X-Skip-Loader': 'true' });
    return this.post<ChatResponse>('/chat/ask', payload, { headers });
  }
}