import { Injectable } from '@angular/core';
import { of, delay } from 'rxjs';
import { UserProfile } from '../interfaces/user-profile';

@Injectable({
  providedIn: 'root'
})
export class MockUserProfileService {
  private mockUser: UserProfile = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+21650123456',
    birthDate: new Date(1990, 0, 1),
    profilePic: 'assets/default_profile_pic.jpg',
    hobbies: [{ name: 'Reading' }, { name: 'Sports' }],
    location: { lat: 36.8065, lng: 10.1815 }
  };

  getUserProfile() {
    return of({ ...this.mockUser }).pipe(delay(500));
  }

  updateUserProfile(profile: UserProfile) {
    return of({ ...profile }).pipe(delay(500));
  }
}
