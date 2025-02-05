import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivityMember } from 'src/app/shared/types/ActivityMember';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<ActivityMember> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ActivityMember>(url);
  }
}
