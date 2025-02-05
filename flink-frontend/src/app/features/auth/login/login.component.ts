import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

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
      this.snackBar.open(
        'Please fill in all required fields correctly.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    const { identifier, password } = this.loginForm.value;
    const loginData = { identifier, password };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.loginForm.reset();
        this.router.navigate(['/feed']);
      },
      error: (err) => {
        console.error('Login error:', err);
        this.snackBar.open(
          'Login failed. Please check your credentials and try again.',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }
  navigateToForgotPassword():void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
