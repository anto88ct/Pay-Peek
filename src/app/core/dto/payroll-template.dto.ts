export interface PayrollTemplate {
    id?: string;
    name: string;          // Es: "Template SEEDMA S.R.L."
    signature: string;     // L'hash SHA-256 del file PDF
    userId: string;        // ID dell'utente proprietario

    // Rappresenta la Map<String, String> di Java
    // Chiave: nome campo (es. "netto"), Valore: stringa Regex
    regexPatterns: { [key: string]: string };

    createdAt?: string;
}