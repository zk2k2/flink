import { Component } from '@angular/core';
import { UserProfile } from './interfaces/user-profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
   mockUser: UserProfile = {
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
}
