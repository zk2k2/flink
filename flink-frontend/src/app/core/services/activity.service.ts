import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Activity {
  creator: {
    firstName: string;
    lastName: string;
    profilePic: string;
  };
  title: string;
  category: {
    icon: string;
    name: string;
  };
  date: string;
  location: string;
  nbOfParticipants: number;
  description: string;
  activityPhotos: string[];
}

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.apiUrl, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${environment.bearerToken}`,
      }),
    });
  }
}
