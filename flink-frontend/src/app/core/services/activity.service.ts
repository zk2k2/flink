import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private activities: Activity[] = []; // Mock data

  getActivities(): Observable<Activity[]> {
    return of(this.activities); // Replace with HTTP call
  }

  participate(activityId: string): void {
    // Add user to activity participants
  }
}