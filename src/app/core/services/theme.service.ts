import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, take } from "rxjs";
import { PrimeNGConfig } from "primeng/api";
import { UserService } from "./user.service";

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  public theme$ = this.themeSubject.asObservable();

  constructor(
    private primeNGConfig: PrimeNGConfig,
    private userService: UserService
  ) {
    this.initTheme();
  }

  /**
   * Imposta il tema localmente e lo sincronizza con il backend
   * @param theme Il tema scelto ('light', 'dark', 'system')
   * @param updateBackend Se true, invia la chiamata API (default: true)
   */
  setTheme(theme: Theme, updateBackend: boolean = true): void {
    const effectiveTheme = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;

    document.documentElement.setAttribute('data-color-scheme', effectiveTheme);
    localStorage.setItem('pay-peek-theme', theme);
    this.themeSubject.next(theme);

    if (updateBackend && this.userService.getCurrentUserSync()) {
      // Conversione obbligatoria in UPPERCASE per il BE
      const themeEnum = theme.toUpperCase();
      this.userService.updateTheme(themeEnum).subscribe();
    }
  }

  public initTheme(): void {
    // 1. Priorità al DB se l'utente è loggato
    this.userService.currentUser$.subscribe(user => {
      if (user?.preferences?.theme) {
        const userTheme = user.preferences.theme.toLowerCase() as Theme;
        if (this.themeSubject.value !== userTheme) {
          this.setTheme(userTheme, false);
        }
      }
    });

    // 2. Fallback su LocalStorage
    const savedTheme = localStorage.getItem('pay-peek-theme') as Theme | null;
    this.setTheme(savedTheme ?? 'system', false);
  }
}