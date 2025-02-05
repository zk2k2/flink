import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfilesServiceService {
  private apiUrl = 'http://localhost:3000/profile';
  private userUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUserProfile(identifier: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${identifier}`);
  }
  updateProfile(updateData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/update`, updateData);
  }
  getUserData(id: string): Observable<any> {
    return this.http.get<any>(`${this.userUrl}/${id}`);
  }
}
