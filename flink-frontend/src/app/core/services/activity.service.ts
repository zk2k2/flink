import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivityCard } from '../../shared/types/ActivityCard';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private apiUrl = `${environment.apiUrl}/activities`;

  constructor(private http: HttpClient) {}

  getActivities(): Observable<ActivityCard[]> {
    return this.http.get<ActivityCard[]>(this.apiUrl);
  }

  getProfileActivities(creatorId: string): Observable<ActivityCard[]> {
    let params = new HttpParams()
      .set('sortBy', 'newest')
      .set('type', 'profile')
      .set('creatorId', creatorId);

    return this.http.get<ActivityCard[]>(this.apiUrl, { params });
  }
}
