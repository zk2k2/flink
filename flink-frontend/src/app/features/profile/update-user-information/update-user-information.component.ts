import { Component } from '@angular/core';
import { UserProfile } from '../interfaces/user-profile';

@Component({
  selector: 'app-update-user-information',
  templateUrl: './update-user-information.component.html',
  styleUrls: ['./update-user-information.component.scss']
})
export class UpdateUserInformationComponent {

user : UserProfile = {
  id: '123456',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe92',
  email: 'johndoe@example.com',
  profilePic: "assets/default_profile_pic.jpg",
  phone: '+21654076724',
  birthDate: new Date('1992-05-15'),
  hobbies: [
    { id: 1, name: 'Photography' },
    { id: 2, name: 'Cycling' },
    { id: 3, name: 'Gaming' },
  ],
  location: {
    lat: 37,
    lng: 35,
  }
};


}
