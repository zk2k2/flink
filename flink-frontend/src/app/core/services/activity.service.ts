import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivityCard } from '../../shared/types/ActivityCard';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = 'http://localhost:3000/activities';
  private activitiesSubject = new BehaviorSubject<ActivityCard[]>([]);
  activities$ = this.activitiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getActivities(
    sortBy: string,
    type: 'feed' | 'profile',
    timeFrame?: 'past' | 'recent',
    creatorId?: string
  ): Observable<ActivityCard[]> {
    const params: any = { sortBy, type };

    if (timeFrame) {
      params.timeFrame = timeFrame;
    }
    if (creatorId) {
      params.creatorId = creatorId;
    }

    return this.http.get<ActivityCard[]>(this.apiUrl, { params }).pipe(
      tap((activities) => {
        this.activitiesSubject.next(activities);
      })
    );
  }

  joinActivity(id: string): Observable<void> {
    const url = `${this.apiUrl}/join`;
    const params = { activityId: id };

    return this.http.patch<void>(url, null, { params });
  }

  getActivityById(id: string): Observable<ActivityCard> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<ActivityCard>(url);
  }

  createActivity(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  leaveActivity(id: string): Observable<void> {
    const url = `${this.apiUrl}/leave`;
    const params = { activityId: id };

    return this.http.patch<void>(url, null, { params });
  }

  getProfileActivities(creatorId: string): Observable<ActivityCard[]> {
    let params = new HttpParams()
      .set('sortBy', 'newest')
      .set('type', 'profile')
      .set('creatorId', creatorId);

    return this.http.get<ActivityCard[]>(this.apiUrl, { params });
  }
  updateActivity(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, formData);
  }

  deleteActivity(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
