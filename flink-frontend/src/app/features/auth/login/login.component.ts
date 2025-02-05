import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showInfobox = false; // Controls infobox visibility
  infoMessage = ''; // Stores the message to display in the infobox
  showPassword = false; // Controls password visibility

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.infoMessage = 'Please fill in all required fields correctly.';
      this.showInfobox = true;
      return;
    }

    const { identifier, password } = this.loginForm.value;

    this.authService.login({ identifier, password }).subscribe({
      next: (response: any) => {
        // Successful login handling
        this.infoMessage = 'Login successful! Redirecting...';
        this.showInfobox = true;

        // Store user data if needed
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }

        // Redirect after delay
        setTimeout(() => {
          this.router.navigate(['/feed']);
          this.loginForm.reset();
        }, 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login error:', err);
        this.loginForm.get('password')?.reset();

        // Handle specific error cases
        if (err.status === 401) {
          this.infoMessage = 'Invalid credentials. Please try again.';
        } else if (err.status === 403) {
          this.infoMessage = 'Account deactivated. Contact support.';
        } else {
          this.infoMessage = 'Login failed. Please try again later.';
        }

        this.showInfobox = true;
        document.getElementById('identifier')?.focus();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}