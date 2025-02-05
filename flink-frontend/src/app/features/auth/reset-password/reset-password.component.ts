import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  loading = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'];
  }

  passwordsMatch(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    console.log("on submit");
    if (this.resetPasswordForm.invalid) return;

    this.loading = true;
    this.authService.resetPassword(this.token, this.resetPasswordForm.value.password).subscribe({
      next: () => {
        this.message = 'Password reset successful. Redirecting...';
        setTimeout(() => {
          this.navigateToLogin();
        }, 3000);
      },
      error: (err) => {
        this.message = 'Error: ' + err.error.message;
        this.loading = false;
      }
    });
  }
  navigateToLogin():void {
    this.router.navigate(['/auth/login']);
  }
}
