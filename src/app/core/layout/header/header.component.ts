import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeService, Theme } from '../../services/theme.service';
import { LanguageService, Language } from '../../services/language.service';
import { MenuItem } from '../../../toolbox/ad-dropdown/ad-dropdown.component';
import { Subject, takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AdInputSwitchComponent } from '../../../toolbox/ad-input-switch/ad-input-switch.component';
import { AdDropdownComponent } from '../../../toolbox/ad-dropdown/ad-dropdown.component';
import { AdDialogComponent } from '../../../toolbox/ad-dialog/ad-dialog.component';
import { AdButtonComponent } from '../../../toolbox/ad-button/ad-button.component';
import { ResetPasswordComponent } from '../../../shared/components/reset-password/reset-password.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { ReminderService } from '../../../core/services/reminder.service';
import { Reminder } from '../../dto/reminder.dto';
import { MonthlyReminderComponent } from '../../../shared/components/monthly-reminder/monthly-reminder.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    AdInputSwitchComponent,
    AdInputSwitchComponent,
    AdDropdownComponent,
    AdDialogComponent,
    AdButtonComponent,
    ResetPasswordComponent,
    MonthlyReminderComponent
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  notificationCount = 0;
  showNotifications = false;
  reminders: Reminder[] = [];
  profileImageUrl = '';
  userName = '';
  isDarkTheme = false;
  isItalian = true; // Track current language (true = IT, false = EN)

  profileMenuItems: MenuItem[] = [];

  // Dialog states
  showResetCacheDialog = false;
  showResetPasswordDialog = false;

  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private userService: UserService,
    private authService: AuthService,
    private reminderService: ReminderService,
    private router: Router,
    private notificationService: NotificationService
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
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      const userId = this.userService.getCurrentUserSync()?.id;
      if (userId == null) {
        this.notificationService.showError("User not found");
        return;
      }
      this.reminderService.getUserReminder(userId).subscribe({
        next: (reminders: Reminder[]) => {
          this.reminders = reminders;
          // Count incomplete reminders
          this.notificationCount = reminders.filter(r => !r.isComplete).length;
        },
        error: (err) => {
          this.notificationService.showError(err);
          this.reminders = [];
        }
      });
    }
  }

  closeNotifications() {
    this.showNotifications = false;
  }

  onThemeChange(isDark: boolean): void {
    this.themeService.setTheme(isDark ? 'dark' : 'light');
  }

  onLanguageChange(isItalian: boolean): void {
    this.languageService.setLanguage(isItalian ? 'it' : 'en');
  }

  updateProfileMenuItems(): void {
    const currentLang = this.languageService.getCurrentLanguage();
    const currentUser = this.userService.getCurrentUserSync();
    const email = currentUser?.email || 'user@example.com';

    if (currentUser != null) {
      this.userName = currentUser.firstName + ' ' + currentUser.lastName;
      this.profileImageUrl = currentUser?.profileImageUrl ?? 'assets/images/placeholder-avatar.png';
    }

    this.profileMenuItems = [
      {
        label: email,
        icon: 'fa-envelope',
        disabled: true
      },
      {
        label: currentLang === 'it' ? 'Reset Password' : 'Reset Password',
        icon: 'fa-key',
        command: () => this.openResetPassword()
      },
      {
        label: currentLang === 'it' ? 'Reset Cache' : 'Reset Cache',
        icon: 'fa-broom',
        command: () => this.confirmResetCache()
      },
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

  confirmResetCache(): void {
    this.showResetCacheDialog = true;
  }

  onResetCacheConfirm(): void {
    this.showResetCacheDialog = false;
    localStorage.clear();
    // Redirect to login
    this.router.navigate(['/login']);
    // Force reload to clear memory state if needed, or just navigate
    // window.location.reload();
  }

  openResetPassword(): void {
    this.showResetPasswordDialog = true;
  }

  onProfileClick(): void {
    this.router.navigate(['/profile']);
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
