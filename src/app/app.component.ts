import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LanguageService } from "./core/services/language.service";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pay-peek-frontend';

  // Nel componente (es. app.component.ts)
  constructor(
    private languageService: LanguageService,
    private themeService: ThemeService // Inject to initialize theme
  ) {
    this.languageService.currentLanguage$.subscribe(lang => {
      console.log('Lingua attiva:', lang); // 'it' o 'en'
    });

    // Cambia lingua
    this.languageService.setLanguage('en');
  }
}



