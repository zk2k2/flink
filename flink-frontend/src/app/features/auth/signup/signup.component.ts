import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { UploadService } from 'src/app/core/services/upload.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, AfterViewInit {
  signupForm!: FormGroup;
  map!: L.Map;
  marker?: L.Marker;
  currentYear = new Date().getFullYear();
  categories: any[] = [];

  private signupApiUrl = 'http://localhost:3000/auth/signup';
  private categoriesApiUrl = 'http://localhost:3000/category';

  private namePattern = /^[a-zA-ZÀ-ÿ\s']{2,50}$/;
  private usernamePattern = /^[a-zA-Z0-9_]{4,20}$/;
  private phonePattern = /^\+?\d{7,15}$/;
  private passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  private urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private uploadService: UploadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group(
      {
        firstName: [
          '',
          [Validators.required, Validators.pattern(this.namePattern)],
        ],
        lastName: [
          '',
          [Validators.required, Validators.pattern(this.namePattern)],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(20),
            Validators.pattern(this.usernamePattern),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        phone: [
          '',
          [Validators.required, Validators.pattern(this.phonePattern)],
        ],
        password: [
          '',
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
        confirmPassword: ['', Validators.required],
        birthDate: ['', [Validators.required, this.ageValidator(13)]],
        // Remove the URL validator here – it will be set automatically after upload.
        profilePic: ['', Validators.required],
        selectedCategory: ['', Validators.required],
        hobbies: this.fb.group({}),
        location: this.fb.group({
          name: [
            { value: '', disabled: true },
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(100),
            ],
          ],
          longitude: [null, Validators.required],
          latitude: [null, Validators.required],
        }),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

  private loadCategories(): void {
    this.http.get<any[]>(this.categoriesApiUrl).subscribe({
      next: (data) => {
        this.categories = data;
        const hobbiesGroup = this.signupForm.get('hobbies') as FormGroup;
        data.forEach((category) => {
          const catHobbies = this.fb.array<FormGroup<any>>([]);

          category.hobbies.forEach((hobby: any) => {
            const hobbyGroup = this.fb.group({
              id: [hobby.id],
              title: [hobby.title],
              categoryId: [category.id],
              checked: [false],
              interestLevel: [
                { value: 3, disabled: true },
                [
                  Validators.required,
                  Validators.min(1),
                  Validators.max(5),
                  this.integerValidator(),
                ],
              ],
            });
            hobbyGroup.get('checked')?.valueChanges.subscribe((checked) => {
              Promise.resolve().then(() => {
                const interestControl = hobbyGroup.get('interestLevel');
                if (checked) {
                  interestControl?.enable({ emitEvent: false });
                } else {
                  interestControl?.disable({ emitEvent: false });
                }
                this.cdr.detectChanges();
              });
            });
            catHobbies.push(hobbyGroup);
          });
          hobbiesGroup.addControl(category.id, catHobbies);
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading categories:', err),
    });
  }

  get filteredHobbies(): FormArray<FormGroup> {
    const selectedCategory = this.signupForm.get('selectedCategory')?.value;
    if (!selectedCategory) {
      return new FormArray<FormGroup>([]);
    }
    const hobbiesGroup = this.signupForm.get('hobbies') as FormGroup;
    return hobbiesGroup.get(selectedCategory) as FormArray<FormGroup>;
  }

  trackByHobbyId(index: number, hobby: FormGroup): string {
    return hobby.get('id')?.value;
  }

  private ageValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age >= minAge ? null : { underage: { requiredAge: minAge } };
    };
  }

  private integerValidator() {
    return (control: AbstractControl): { [key: string]: any } | null => {
      return Number.isInteger(control.value) ? null : { notInteger: true };
    };
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([36.80649, 10.16579], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.setMarker(lat, lng);
      this.fetchAddress(lat, lng);
    });
  }

  private setMarker(lat: number, lng: number): void {
    const customIcon = L.icon({
      iconUrl: 'assets/marker.png',
      iconSize: [38, 50],
      iconAnchor: [19, 50],
      popupAnchor: [0, -50],
    });
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
    this.signupForm.get('location')!.patchValue({
      longitude: lng,
      latitude: lat,
    });
  }

  private fetchAddress(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.display_name) {
          this.signupForm
            .get('location')
            ?.patchValue({ name: data.display_name });
        }
      },
      error: (err) => console.error('Error fetching address:', err),
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.uploadService.uploadFile(file).subscribe({
        next: (response: { fileUrl: string }) => {
          this.signupForm.patchValue({ profilePic: response.fileUrl });
          this.snackBar.open('File uploaded successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error: any) => {
          console.error('File upload error:', error);
          this.snackBar.open('File upload failed', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.snackBar.open('Please fix all validation errors', 'Close', {
        duration: 3000,
      });
      return;
    }

    const hobbiesGroup = this.signupForm.get('hobbies') as FormGroup;
    const checkedHobbies: any[] = [];
    Object.keys(hobbiesGroup.controls).forEach((catId) => {
      const catArray = hobbiesGroup.get(catId) as FormArray;
      catArray.controls.forEach((ctrl) => {
        if (ctrl.get('checked')?.value) {
          checkedHobbies.push({
            hobbyId: ctrl.get('id')?.value,
            interestLevel: ctrl.get('interestLevel')?.value,
          });
        }
      });
    });

    const formData = {
      ...this.signupForm.getRawValue(),
      hobbies: checkedHobbies,
    };
    delete formData.selectedCategory;

    this.http.post(this.signupApiUrl, formData).subscribe({
      next: (res: any) => {
        this.snackBar.open('Registration successful!', 'Close', {
          duration: 3000,
        });

        // Automatically log in the user after successful registration
        const loginCredentials = {
          identifier: formData.email, // or formData.username, depending on your backend
          password: formData.password,
        };

        this.authService.login(loginCredentials).subscribe((success) => {
          if (success) {
            this.router.navigate(['/feed']); // Redirect to /feed after successful login
          } else {
            this.snackBar.open('Login after registration failed', 'Close', {
              duration: 3000,
            });
          }
        });

        this.signupForm.reset();
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.handleBackendErrors(err);
      },
    });
  }

  private handleBackendErrors(error: any): void {
    if (error.status === 400 && error.error?.message) {
      error.error.message.forEach((msg: string) => {
        if (msg.includes('email'))
          this.signupForm.get('email')?.setErrors({ backendError: msg });
        if (msg.includes('username'))
          this.signupForm.get('username')?.setErrors({ backendError: msg });
      });
      this.snackBar.open('Validation errors occurred', 'Close', {
        duration: 5000,
      });
    } else {
      this.snackBar.open('Registration failed. Please try again.', 'Close', {
        duration: 3000,
      });
    }
  }
}
