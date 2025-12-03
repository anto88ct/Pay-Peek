import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService, Theme } from '../../services/theme.service';
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

  private destroy$ = new Subject<void>();

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.theme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme: Theme) => {
        // If theme is 'system', check the actual applied theme
        if (theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          this.isDarkTheme = prefersDark;
        } else {
          this.isDarkTheme = theme === 'dark';
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goHome() { }
  openNotifications() { }

  onThemeChange(isDark: boolean): void {
    // Toggle between light and dark (no system mode for now)
    this.themeService.setTheme(isDark ? 'dark' : 'light');
  }

  openProfileMenu() { }

}
