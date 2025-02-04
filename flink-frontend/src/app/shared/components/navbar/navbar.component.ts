import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isLoggedIn$!: Observable<boolean>;
  menuItems = [
    { label: 'Home', icon: 'home', route: '/home' },
    { label: 'Start activity', icon: 'queue', route: '/activity/new' },
    { label: 'About us', icon: 'info', route: '/about' },
    { label: 'My profile', icon: 'person', route: '/profile' },
  ];
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }
}
