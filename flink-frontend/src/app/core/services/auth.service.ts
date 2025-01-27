import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;

  login(email: string, password: string): void {
    // Call your backend API here
    this.isAuthenticated = true;
    localStorage.setItem('token', 'dummy-token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
