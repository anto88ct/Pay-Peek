import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  notificationCount = 3;
  profileImageUrl = 'assets/images/placeholder-avatar.png';
  userName = 'Mario Rossi';

  goHome() { }
  openNotifications() { }
  toggleTheme() { }
  openProfileMenu() { }

}
