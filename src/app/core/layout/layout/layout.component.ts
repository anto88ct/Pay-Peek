import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    HeaderComponent,
    SidebarComponent,
    BottomNavComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isMobile$!: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {

    this.isMobile$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => {
          return result.matches;
        }),
        shareReplay(1)
      );

    this.isMobile$.subscribe(isMobile => {
    });
  }
}
