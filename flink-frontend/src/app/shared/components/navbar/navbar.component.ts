import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  menuItems: any[] = [];
  currentRoute: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isLoggedIn();

    // Dynamically set menu items after login status is determined
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.menuItems = [
        { label: 'Home', icon: 'home', route: '/feed' },
        { label: 'Start activity', icon: 'queue', route: '/activity' },
        { label: 'About us', icon: 'info', route: '/about' },
        {
          label: 'My profile',
          icon: 'person',
          route: isLoggedIn
            ? `/profile/${this.authService.getCurrentUserId()}`
            : '/auth/login',
        },
      ];
    });

    // Listen for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
