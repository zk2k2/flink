import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  menuItems = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Start activity', icon: 'queue', route: '/activity/new' },
    { label: 'About us', icon: 'info', route: '/about' },
    { label: 'My profile', icon: 'person', route: '/profile' },
  ];
}
