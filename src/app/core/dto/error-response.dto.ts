export interface ErrorResponseDto {
    statusCode: number;
    message: string;
    error?: string;
    timestamp?: string;
    path?: string;
    details?: any;
}

// Client-side error wrapper
export interface ClientError {
    type: 'client' | 'server' | 'network';
    statusCode?: number;
    message: string;
    originalError?: any;
}
