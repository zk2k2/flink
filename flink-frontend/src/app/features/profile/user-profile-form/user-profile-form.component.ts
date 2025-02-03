import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProfile } from '../interfaces/user-profile';

@Component({
  selector: 'app-user-profile-form',
  templateUrl: './user-profile-form.component.html',
  styleUrls: ['./user-profile-form.component.scss']
})
export class UserProfileFormComponent implements OnInit {
  @Input() initialData?: UserProfile;
  profileForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    if (this.initialData) {
      this.setFormValues(this.initialData);
    }
    alert('All Cookies:'+ document.cookie);
    const accessToken = getCookie('accessToken');
    alert('Access Token:'+ accessToken);
  }

  private initializeForm() {
    this.profileForm = this.fb.group({
      firstName: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      username: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\+216\d{8}$/)]],
      birthDate: [{ value: '', disabled: true }, Validators.required],
      profilePic: [{ value: '', disabled: true }],
      hobbies: this.fb.array([]),
      location: this.fb.group({
        lat: [{ value: 0, disabled: true }, Validators.required],
        lng: [{ value: 0, disabled: true }, Validators.required]
      })
    });
  }

  private setFormValues(data: UserProfile) {
    this.profileForm.patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      birthDate: data.birthDate.toISOString().substring(0, 10),
      profilePic: data.profilePic,
      location: this.fb.group({
        lat: [data.location ? data.location.lat : ''],
        lng: [data.location ? data.location.lng : '']
      })
    });

    const hobbiesArray = this.profileForm.get('hobbies') as FormArray;
    data.hobbies.forEach(hobby => {
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
    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      const formValue = this.profileForm.value;
      const updatedProfile: UserProfile = {
        ...this.initialData,
        ...formValue,
        hobbies: formValue.hobbies.map((name: string) => ({ name })),
        birthDate: new Date(formValue.birthDate)
      };
      
      // Here you would call your service
      console.log('Submitting:', updatedProfile);
      this.isLoading = false;
      this.toggleEdit();
    }
  }


  
}
function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}