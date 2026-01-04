export interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
    timestamp: string;
}

export interface ChatSession {
    id: string;
    title: string;
    updatedAt?: string;
    messages: ChatMessage[];
}

export interface ChatRequest {
    query: string;
    sessionId?: string;
}

export interface ChatResponse {
    answer: string;
    sessionId: string;
    title: string;
}