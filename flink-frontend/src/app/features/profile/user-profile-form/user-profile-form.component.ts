import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProfilesServiceService } from '../profiles-service.service';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss'],
})
export class UserProfileFormComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfilesServiceService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.fetchUserData();
  }

  private initializeForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+216\d{8}$/)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).+$/),
        ],
      ],
      birthDate: ['', Validators.required],
      profilePic: [''],
      hobbies: this.fb.array([]),
      location: this.fb.group({
        name: ['', Validators.required],
        lat: [
          0,
          [Validators.required, Validators.min(-90), Validators.max(90)],
        ],
        lng: [
          0,
          [Validators.required, Validators.min(-180), Validators.max(180)],
        ],
      }),
    });
  }

  private fetchUserData() {
    this.isLoading = true;
    this.profileService
      .getUserProfile(this.authService.getCurrentUserId())
      .subscribe({
        next: (data) => {
          this.setFormValues(data);
          console.log('User data:', data);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load profile data.';
          this.isLoading = false;
        },
      });
  }

  private setFormValues(data: any) {
    const locationData = data.location || { name: '', lat: 0, lng: 0 };
    this.profileForm.patchValue({
      ...data,
      birthDate: data.birthDate ? data.birthDate.substring(0, 10) : '',
      location: locationData,
    });

    const hobbiesArray = this.profileForm.get('hobbies') as FormArray;
    hobbiesArray.clear();
    data.hobbies?.forEach((hobby: { name: string }) => {
      hobbiesArray.push(this.fb.control(hobby.name, Validators.required));
    });
  }

  get hobbies() {
    return this.profileForm.get('hobbies') as FormArray;
  }

  addHobby() {
    this.hobbies.push(this.fb.control('', Validators.required));
  }

  removeHobby(index: number) {
    this.hobbies.removeAt(index);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    Object.keys(this.profileForm.controls).forEach((controlName) => {
      const control = this.profileForm.get(controlName);
      control?.[this.isEditing ? 'enable' : 'disable']();
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formValue = this.profileForm.value;
      const updatedData = {
        ...formValue,
        birthDate: new Date(formValue.birthDate),
        hobbies: formValue.hobbies.map((name: string) => ({ name })),
        location: {
          name: formValue.location.name,
          lat: parseFloat(formValue.location.lat),
          lng: parseFloat(formValue.location.lng),
        },
      };

      this.profileService.updateProfile(updatedData).subscribe({
        next: () => {
          this.isLoading = false;
          this.toggleEdit();
        },
        error: (error) => {
          this.errorMessage = 'Failed to update profile.';
          this.isLoading = false;
        },
      });
    }
  }
}
