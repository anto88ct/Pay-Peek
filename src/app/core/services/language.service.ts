import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'it' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('it');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();
  private supportedLanguages: Language[] = ['it', 'en'];
  private translateService = inject(TranslateService);

  constructor() {
    this.initLanguage();
  }

  initLanguage(): void {
    // 1. Prova a caricare lingua salvata in localStorage
    let savedLanguage = localStorage.getItem('pay-peek-language') as Language | null;

    // 2. Se non esiste o non è supportata, rileva lingua browser
    if (!savedLanguage || !this.supportedLanguages.includes(savedLanguage)) {
      savedLanguage = this.detectBrowserLanguage();
    }

    // 3. Imposta la lingua usando il metodo setLanguage
    this.setLanguage(savedLanguage);
  }

  setLanguage(language: Language): void {
    // Imposta la lingua nel TranslateService
    this.translateService.use(language);

    // Salva in localStorage
    localStorage.setItem('pay-peek-language', language);

    // Notifica subscribers
    this.currentLanguageSubject.next(language);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  getSupportedLanguages(): Language[] {
    return this.supportedLanguages;
  }

  // Traduce una chiave con parametri
  translate(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  // Traduce istantaneamente (sincrono)
  instantTranslate(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  private detectBrowserLanguage(): Language {
    const browserLang = this.translateService.getBrowserLang();
    // Mappa browser lang a lingue supportate (it-IT, it → 'it', en → 'en')
    return this.supportedLanguages.includes(browserLang as Language)
      ? browserLang as Language
      : 'it'; // Default italiano
  }
}
