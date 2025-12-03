import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isMobile$!: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    console.log('🔍 LayoutComponent ngOnInit');  // ← AGGIUNGI

    this.isMobile$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => {
          console.log('📱 isMobile:', result.matches, 'width:', window.innerWidth);  // ← AGGIUNGI
          return result.matches;
        }),
        shareReplay(1)
      );

    // SUBSCRIBE per vedere il valore reale
    this.isMobile$.subscribe(isMobile => {
      console.log('🎯 isMobile$ valore FINALE:', isMobile);
    });
  }
}
