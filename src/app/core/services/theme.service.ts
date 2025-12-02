import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {PrimeNGConfig} from "primeng/api";

export type Theme = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<Theme>('light');
  public theme$ = this.themeSubject.asObservable();

  constructor(private primeNGConfig: PrimeNGConfig) {
    this.initTheme();
  }

  setTheme(theme: Theme): void {
    const effectiveTheme = theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : theme;

    document.documentElement.setAttribute('data-color-scheme', effectiveTheme);
    localStorage.setItem('pay-peek-theme', theme);
    this.themeSubject.next(theme);
  }

  initTheme(): void {
    // Legge il tema salvato in localStorage (se presente)
    const savedTheme = localStorage.getItem('pay-peek-theme') as Theme | null;

    // Se non c'è tema salvato, usa 'system' come default
    const themeToApply: Theme = savedTheme ?? 'system';

    // Imposta il tema usando il metodo setTheme già definito
    this.setTheme(themeToApply);

    // Ascolta i cambiamenti della preferenza sistema (solo se theme = system)
    if (themeToApply === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', e => {
        this.setTheme('system');
      });
    }
  }

}
