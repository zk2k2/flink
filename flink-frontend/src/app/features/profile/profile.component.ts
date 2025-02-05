import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProfilesServiceService } from './profiles-service.service';
import { ActivityService } from 'src/app/core/services/activity.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivityCard } from 'src/app/shared/types/ActivityCard';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as L from 'leaflet';
import { UploadService } from 'src/app/core/services/upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  user: any = null;
  isCurrentUser: boolean = false;
  activities: ActivityCard[] = [];

  editing = false;

  profileForm!: FormGroup;
  get hobbiesArray(): FormArray {
    return this.profileForm.get('hobbies') as FormArray;
  }

  private map!: L.Map;
  private marker?: L.Marker;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private profileService: ProfilesServiceService,
    private authService: AuthService,
    private activityService: ActivityService,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('userid');
      if (userId) {
        this.loadUserProfile(userId);
        this.loadUserActivities(userId);
        this.checkIfCurrentUser(userId);
      }
    });
    this.initProfileForm();
  }

  ngAfterViewInit(): void {
    if (this.editing) {
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (this.editing) {
      setTimeout(() => {
        this.initMap();
      }, 0);
    }
  }

  private loadUserProfile(userId: string): void {
    this.profileService.getUserProfile(userId).subscribe({
      next: (userData) => {
        this.user = userData;
        if (this.profileForm) {
          this.profileForm.patchValue({
            firstName: this.user?.firstName || '',
            lastName: this.user?.lastName || '',
            username: this.user?.username || '',
            email: this.user?.email || '',
            phone: this.user?.phone || '',
            password: '',
            birthDate: this.user?.birthDate || '',
            profilePic: this.user?.profilePic || '',
            location: {
              name: this.user?.location?.name || '',
              longitude: this.user?.location?.longitude || null,
              latitude: this.user?.location?.latitude || null
            }
          });
        }
        console.log('User data:', this.user);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadUserActivities(userId: string): void {
    this.activityService.getProfileActivities(userId).subscribe({
      next: (activities) => {
        this.activities = activities;
        console.log('User activities:', this.activities);
      },
      error: (error) => {
        console.error('Error loading activities:', error);
      }
    });
  }

  private checkIfCurrentUser(userId: string): void {
    const currentUserId = this.authService.getCurrentUserId();
    console.log('Current user ID:', currentUserId);
    this.isCurrentUser = userId === currentUserId;
    console.log('Is current user:', this.isCurrentUser);
  }

  private initProfileForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8),
         Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/)]],
      birthDate: ['', Validators.required],
      profilePic: ['', Validators.required],
      hobbies: this.fb.array([]),
      location: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        longitude: [null, Validators.required],
        latitude: [null, Validators.required]
      })
    });

    const dummyHobbies = [
      { id: '550e8400-e29b-41d4-a716-446655440000', title: 'Reading', checked: false, interestLevel: 3 },
      { id: '550e8400-e29b-41d4-a716-446655440001', title: 'Traveling', checked: true, interestLevel: 4 },
      { id: '550e8400-e29b-41d4-a716-446655440002', title: 'Gaming', checked: false, interestLevel: 2 }
    ];
    const hobbiesArray = this.profileForm.get('hobbies') as FormArray;
    dummyHobbies.forEach(hobby => {
      const hobbyGroup = this.fb.group({
        id: [hobby.id],
        title: [hobby.title],
        checked: [hobby.checked],
        interestLevel: [hobby.interestLevel, [Validators.required, Validators.min(1), Validators.max(5)]]
      });
      hobbyGroup.get('checked')?.valueChanges.subscribe(checked => {
        const interestControl = hobbyGroup.get('interestLevel');
        if (checked) {
          interestControl?.enable({ emitEvent: false });
        } else {
          interestControl?.disable({ emitEvent: false });
        }
        this.cdr.detectChanges();
      });
      hobbiesArray.push(hobbyGroup);
    });
  }

  private initMap(): void {
    const mapContainer = document.getElementById('editMap');
    if (!mapContainer) {
      return;
    }

    const initLat = this.profileForm.get('location.latitude')?.value || 36.80649;
    const initLng = this.profileForm.get('location.longitude')?.value || 10.16579;

    this.map = L.map('editMap').setView([initLat, initLng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    if (initLat && initLng) {
      this.setMarker(initLat, initLng);
    }

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
    this.profileForm.get('location')?.patchValue({
      longitude: lng,
      latitude: lat
    });
  }

  private fetchAddress(lat: number, lng: number): void {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        if (data && data.display_name) {
          this.profileForm.get('location')?.patchValue({ name: data.display_name });
        }
      },
      error: (err) => console.error('Error fetching address:', err)
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = input.files[0];
      this.uploadService.uploadFile(file).subscribe({
        next: (response: { fileUrl: string }) => {
          this.profileForm.patchValue({ profilePic: response.fileUrl });
          this.snackBar.open('File uploaded successfully', 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          console.error('File upload error:', error);
          this.snackBar.open('File upload failed', 'Close', { duration: 3000 });
        }
      });
    }
  }
  onSubmitProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      this.snackBar.open('Please fix all validation errors', 'Close', { duration: 3000 });
      return;
    }
    const hobbiesData = (this.profileForm.get('hobbies') as FormArray).controls.map(ctrl => ({
      hobbyId: ctrl.get('id')?.value,
      interestLevel: ctrl.get('interestLevel')?.value,
      checked: ctrl.get('checked')?.value
    }));
    const formData = {
      ...this.profileForm.getRawValue(),
      hobbies: hobbiesData
    };

    this.profileService.updateProfile(formData).subscribe({
      next: (res: any) => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.loadUserProfile(this.user.id);
        this.editing = false;
      },
      error: (err) => {
        console.error('Profile form data:', formData);
        console.error('Profile update error:', err);
        this.snackBar.open('Profile update failed. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }


  
  
}
