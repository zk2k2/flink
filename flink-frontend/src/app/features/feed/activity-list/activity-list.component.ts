import { Component, OnInit } from '@angular/core';
import { ActivityService } from 'src/app/core/services/activity.service';
import { ActivityCard } from 'src/app/shared/types/ActivityCard';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  standalone: false,
})
export class ActivityListComponent implements OnInit {
  activities: ActivityCard[] = [];

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.getActivities().subscribe((activities) => {
      console.log(activities);
      this.activities = activities;
    });
  }
}
