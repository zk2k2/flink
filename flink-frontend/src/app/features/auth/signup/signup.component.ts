import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit {
  signupForm!: FormGroup;
  map!: L.Map;
  marker?: L.Marker;
  currentYear = new Date().getFullYear();

  private signupApiUrl = 'http://localhost:3000/auth/signup';
  private hobbiesApiUrl = 'http://localhost:3000/hobbies';

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
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadHobbies();
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.pattern(this.namePattern)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern(this.namePattern)
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern(this.usernamePattern)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phone: ['', [
        Validators.required,
        Validators.pattern(this.phonePattern)
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern(this.passwordPattern)
      ]],
      birthDate: ['', [
        Validators.required,
        this.ageValidator(13)
      ]],
      profilePic: ['', [
        Validators.required,
        Validators.pattern(this.urlPattern)
      ]],
      hobbies: this.fb.array([]),
      location: this.fb.group({
        // The "name" control will be auto-populated via reverse geocoding.
        name: [{ value: '', disabled: true }, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)
        ]],
        longitude: [null, Validators.required],
        latitude: [null, Validators.required]
      })
    });
  }

  private loadHobbies(): void {
    this.http.get<any[]>(this.hobbiesApiUrl).subscribe({
      next: (data) => {
        const hobbiesArray = this.signupForm.get('hobbies') as FormArray;
        data.forEach(hobby => {
          hobbiesArray.push(this.fb.group({
            id: [hobby.id],
            title: [hobby.title],
            interestLevel: [3, [
              Validators.required,
              Validators.min(1),
              Validators.max(5),
              this.integerValidator()
            ]]
          }));
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading hobbies:', err)
    });
  }

  private ageValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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

  get hobbies(): FormArray {
    return this.signupForm.get('hobbies') as FormArray;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([36.80649, 10.16579], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
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
      popupAnchor: [0, -50]
    });
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    }
    // Update the longitude and latitude in the form.
    this.signupForm.get('location')!.patchValue({
      longitude: lng,
      latitude: lat
    });
  }

  private fetchAddress(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.display_name) {
          this.signupForm.get('location')?.patchValue({ name: data.display_name });
        }
      },
      error: (err) => console.error('Error fetching address:', err)
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.snackBar.open('Please fix all validation errors', 'Close', { duration: 3000 });
      return;
    }
  
    const formData = { ...this.signupForm.getRawValue() };
    this.http.post(this.signupApiUrl, formData).subscribe({
      next: (res: any) => {
        const { accessToken, refreshToken } = res;
        
        document.cookie = `accessToken=${accessToken}; path=/;`;
        document.cookie = `refreshToken=${refreshToken}; path=/;`;
        
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
        
        this.signupForm.reset();
  
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.error('Registration error:', err);
        this.handleBackendErrors(err);
      }
    });
  }
  

  private handleBackendErrors(error: any): void {
    if (error.status === 400 && error.error?.message) {
      error.error.message.forEach((msg: string) => {
        if (msg.includes('email')) this.signupForm.get('email')?.setErrors({ backendError: msg });
        if (msg.includes('username')) this.signupForm.get('username')?.setErrors({ backendError: msg });
      });
      this.snackBar.open('Validation errors occurred', 'Close', { duration: 5000 });
    } else {
      this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
    }
  }
}
