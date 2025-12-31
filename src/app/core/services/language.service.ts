import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';

export type Language = 'it' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>('it');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private supportedLanguages: Language[] = ['it', 'en'];

  private translateService = inject(TranslateService);
  private userService = inject(UserService); // Iniezione del servizio utente

  constructor(private notificationService: NotificationService) {
    this.initLanguage();
  }

  /**
   * Inizializzazione: prioritizza LocalStorage e Browser, 
   * poi si aggiorna se l'utente loggato ha una preferenza diversa sul DB.
   */
  initLanguage(): void {
    // 1. Caricamento iniziale (LocalStorage o Browser)
    let savedLanguage = localStorage.getItem('pay-peek-language') as Language | null;
    if (!savedLanguage || !this.supportedLanguages.includes(savedLanguage)) {
      savedLanguage = this.detectBrowserLanguage();
    }

    // Applichiamo subito la lingua locale
    this.setLanguage(savedLanguage, false);

    // 2. Sincronizzazione dal profilo Utente (Backend -> UI)
    this.userService.currentUser$.pipe(
      filter(user => !!user?.preferences?.language)
    ).subscribe(user => {
      const dbLang = user!.preferences!.language.toLowerCase() as Language;

      if (dbLang !== this.currentLanguageSubject.value) {
        this.setLanguage(dbLang, false);
      }
    });
  }

  /**
   * Imposta la lingua e la sincronizza con il backend se necessario
   * @param language 'it' | 'en'
   * @param updateBackend se true, invia la PATCH al server
   */
  setLanguage(language: Language, updateBackend: boolean = true): void {
    // Imposta la lingua nel TranslateService (ngx-translate)
    this.translateService.use(language);

    // Salva in localStorage
    localStorage.setItem('pay-peek-language', language);

    // Notifica subscribers
    this.currentLanguageSubject.next(language);

    // Sincronizzazione con Backend
    if (updateBackend) {
      const currentUser = this.userService.getCurrentUserSync();
      if (currentUser) {
        // Convertiamo in UPPERCASE per il BE (Enum Language { IT, EN })
        const langEnum = language.toUpperCase();
        this.userService.updateLanguage(langEnum).subscribe({
          next: () => { },
          error: (err) => this.notificationService.showError(err)
        });
      }
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  getSupportedLanguages(): Language[] {
    return this.supportedLanguages;
  }

  translate(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  instantTranslate(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  private detectBrowserLanguage(): Language {
    const browserLang = this.translateService.getBrowserLang();
    return this.supportedLanguages.includes(browserLang as Language)
      ? browserLang as Language
      : 'it';
  }
}