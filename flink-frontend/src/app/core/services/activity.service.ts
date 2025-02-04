import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivityCard } from '../../shared/types/ActivityCard';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivities(): Observable<ActivityCard[]> {
    return this.http.get<ActivityCard[]>(this.apiUrl, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${environment.bearerToken}`,
      }),
    });
  }
}
