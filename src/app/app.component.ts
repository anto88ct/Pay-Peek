import { Component } from '@angular/core';
import { LanguageService } from "./core/services/language.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pay-peek-frontend';

  // Nel componente (es. app.component.ts)
  constructor(private languageService: LanguageService) {
    this.languageService.currentLanguage$.subscribe(lang => {
      console.log('Lingua attiva:', lang); // 'it' o 'en'
    });

    // Cambia lingua
    this.languageService.setLanguage('en');
  }


}
