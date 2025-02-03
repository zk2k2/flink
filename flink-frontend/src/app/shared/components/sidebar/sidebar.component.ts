import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  menuItems = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Start activity', icon: 'info', route: '/about' },
    { label: 'Contact', icon: 'mail', route: '/contact' },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}
}
