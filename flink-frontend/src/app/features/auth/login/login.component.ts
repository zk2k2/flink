import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
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

  private singleIdentifierValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const email = group.get('email')?.value;
    const username = group.get('username')?.value;
    const phone = group.get('phone')?.value;

    const filledFields = [email, username, phone].filter(
      (val) => val && val.toString().trim() !== ''
    );
    if (filledFields.length === 0) {
      return {
        ['noIdentifier']:
          'Please provide either an email, username, or phone number.',
      };
    } else if (filledFields.length > 1) {
      return {
        ['multipleIdentifiers']:
          'Please fill in only one: email, username, or phone number.',
      };
    }
    return null;
  };

  private initializeForm(): void {
    this.loginForm = this.fb.group(
      {
        email: [''],
        username: [''],
        phone: [''],
        password: ['', Validators.required],
      },
      { validators: this.singleIdentifierValidator }
    );
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      const errors = this.loginForm.errors;
      if (errors?.['noIdentifier']) {
        this.snackBar.open(errors['noIdentifier'], 'Close', { duration: 3000 });
      } else if (errors?.['multipleIdentifiers']) {
        this.snackBar.open(errors['multipleIdentifiers'], 'Close', {
          duration: 3000,
        });
      } else {
        this.snackBar.open(
          'Please fill in all required fields correctly.',
          'Close',
          { duration: 3000 }
        );
      }
      return;
    }

    let { email, username, phone, password } = this.loginForm.value;
    let identifier = '';

    if (email && email.trim() !== '') {
      identifier = email;
    } else if (username && username.trim() !== '') {
      identifier = username;
    } else if (phone && phone.trim() !== '') {
      phone = phone.trim();
      if (!phone.startsWith('+216')) {
        phone = '+216' + phone;
      }
      identifier = phone;
    }

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
}
