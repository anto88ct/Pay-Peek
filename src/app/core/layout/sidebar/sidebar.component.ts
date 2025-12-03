import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SidebarItem } from 'src/app/toolbox/ad-sidebar/ad-sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  navItems: SidebarItem[] = [
    { id: 'dashboard', icon: 'fa-solid fa-chart-line', label: 'Dashboard' },
    { id: 'chatbot', icon: 'fa-solid fa-robot', label: 'Chatbot' },
    { id: 'files', icon: 'fa-solid fa-folder-open', label: 'Files' },
    { id: 'profile', icon: 'fa-solid fa-user', label: 'Profilo' },
    { id: 'settings', icon: 'fa-solid fa-cog', label: 'Settings' }
  ];

  activeItemId: string = 'dashboard';

  constructor(private router: Router) { }

  ngOnInit() {
    this.setActiveItem(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setActiveItem(event.urlAfterRedirects);
    });
  }

  setActiveItem(url: string) {
    if (url.includes('dashboard')) this.activeItemId = 'dashboard';
    else if (url.includes('chatbot')) this.activeItemId = 'chatbot';
    else if (url.includes('files')) this.activeItemId = 'files';
    else if (url.includes('profile')) this.activeItemId = 'profile';
    else if (url.includes('settings')) this.activeItemId = 'settings';
  }

  onNavClick(item: SidebarItem) {
    this.activeItemId = item.id;
    switch (item.id) {
      case 'dashboard': this.router.navigate(['/dashboard']); break;
      case 'chatbot': this.router.navigate(['/chatbot']); break;
      case 'files': this.router.navigate(['/files']); break;
      case 'profile': this.router.navigate(['/profile']); break;
      case 'settings': this.router.navigate(['/settings']); break;
      default: break;
    }
  }
}
