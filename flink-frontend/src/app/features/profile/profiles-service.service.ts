import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from './interfaces/user-profile';

@Injectable({
  providedIn: 'root'
})
export class ProfilesServiceService {

  private apiUrl = `localhost:3000/users`;

  constructor(private http: HttpClient) { }

  getUserProfile(userId: string | null): any {

  //needing authentication
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);

  }

}