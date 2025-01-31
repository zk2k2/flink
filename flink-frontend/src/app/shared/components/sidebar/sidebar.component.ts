import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isScreenSmall: boolean = false;
  isCollapsed: boolean = false;
  hasUserCollapsed: boolean = false;

  menuItems: MenuItem[] = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Profile', icon: 'person', route: '/profile' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
        if (!this.hasUserCollapsed) {
          this.isCollapsed = this.isScreenSmall;
        }
      });
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.hasUserCollapsed = true;
  }
}
