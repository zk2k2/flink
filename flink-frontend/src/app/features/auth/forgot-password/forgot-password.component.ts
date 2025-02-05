import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar 
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      this.showSnackbar('Please enter a valid email address', 'warning');
      return;
    }

    this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
      next: (response) => {
        this.showSnackbar('Check your email for reset instructions.', 'success');
        this.navigateToLogin();
      },
      error: (err) => {
        if (err.status === 404) {
          this.showSnackbar('No account found with this email address.', 'error');
        } else {
          this.showSnackbar('An unexpected error occurred. Please try again later.', 'error');
        }
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'warning') {
    let panelClass = '';
    switch (type) {
      case 'success':
        panelClass = 'snackbar-success';
        break;
      case 'error':
        panelClass = 'snackbar-error';
        break;
      case 'warning':
        panelClass = 'snackbar-warning';
        break;
    }
    this.snackBar.open(message, 'OK', { duration: 3000, panelClass });
  }
}
