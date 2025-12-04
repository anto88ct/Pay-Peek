import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService, Theme } from '../../services/theme.service';
import { LanguageService, Language } from '../../services/language.service';
import { MenuItem } from '../../../toolbox/ad-dropdown/ad-dropdown.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  notificationCount = 3;
  profileImageUrl = 'assets/images/placeholder-avatar.png';
  userName = 'Mario Rossi';
  isDarkTheme = false;
  isItalian = true; // Track current language (true = IT, false = EN)

  profileMenuItems: MenuItem[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme: Theme) => {
        if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.isDarkTheme = prefersDark;
        } else {
          this.isDarkTheme = theme === 'dark';
        }
      });

    // Subscribe to language changes
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang: Language) => {
        this.isItalian = lang === 'it';
        this.updateProfileMenuItems();
      });

    // Initialize menu items
    this.updateProfileMenuItems();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goHome() {
    this.router.navigate(['/dashboard']);
  }

  openNotifications() {
    console.log('Notifications clicked');
  }

  onThemeChange(isDark: boolean): void {
    this.themeService.setTheme(isDark ? 'dark' : 'light');
  }

  onLanguageChange(isItalian: boolean): void {
    this.languageService.setLanguage(isItalian ? 'it' : 'en');
  }

  updateProfileMenuItems(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    this.profileMenuItems = [
      {
        label: currentLang === 'it' ? 'Profilo' : 'Profile',
        icon: 'fa-user',
        command: () => this.onProfileClick()
      },
      {
        label: currentLang === 'it' ? 'Esci' : 'Logout',
        icon: 'fa-sign-out-alt',
        command: () => this.onLogoutClick()
      }
    ];
  }

  onProfileClick(): void {
    console.log('Profile clicked');
    this.router.navigate(['/profile']);
  }

  onLogoutClick(): void {
    console.log('Logout clicked');
    // TODO: Implement logout logic
  }
}
